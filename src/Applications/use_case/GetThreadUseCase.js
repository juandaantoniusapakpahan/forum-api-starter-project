const GetReplies = require("../../Domains/replies/entities/GetReplies");

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThread(threadId);
    const getComments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    const repliesArr = await this._repliesRepository.getReplies(threadId);

    for (let i = 0; i < getComments.length; i++) {
      let repliesIns = [];
      for (let j = 0; j < repliesArr.length; j++) {
        if (repliesArr[j].comment_id === getComments[i].id) {
          repliesIns.push(new GetReplies({ ...repliesArr[j] }));
        }
      }
      getComments[i].replies = repliesIns;
    }
    thread.comments = getComments;
    return thread;
  }
}
module.exports = GetThreadUseCase;
