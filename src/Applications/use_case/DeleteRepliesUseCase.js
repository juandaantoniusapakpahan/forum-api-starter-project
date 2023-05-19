class DeleteRepliesUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(threadId, commentId, repliesId, owner) {
    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.verifyCommentIsExists(commentId);
    await this._repliesRepository.verifyRepliesIsExists(repliesId);
    await this._repliesRepository.isAuthorized(repliesId, owner);
    return this._repliesRepository.delete(repliesId);
  }
}

module.exports = DeleteRepliesUseCase;
