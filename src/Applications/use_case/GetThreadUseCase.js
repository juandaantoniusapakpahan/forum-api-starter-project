const GetReplies = require("../../Domains/replies/entities/GetReplies");

class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    repliesRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThread(threadId);
    const getComments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );
    const repliesArr = await this._repliesRepository.getReplies(threadId);
    const getLikeCount = await this._likeRepository.getLikeCount();

    var count = {};
    thread.comments = getComments.map((comment) => {
      comment.replies = repliesArr
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new GetReplies(reply));

      count = getLikeCount.find((like) => like.comment_id === comment.id);
      comment.likeCount =
        count === undefined ? 0 : parseInt(count["likecount"]);
      return comment;
    });
    return thread;
  }
}
module.exports = GetThreadUseCase;
