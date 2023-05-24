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

    thread.comments = getComments.map((comment) => {
      comment.replies = repliesArr
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new GetReplies(reply));
      return comment;
    });

    return thread;
  }
}
module.exports = GetThreadUseCase;
