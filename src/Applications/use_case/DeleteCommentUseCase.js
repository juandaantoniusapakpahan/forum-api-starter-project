class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, comentId, owner) {
    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.verifyCommentIsExists(comentId);
    await this._commentRepository.isAuthorized(comentId, owner);
    return this._commentRepository.deleteComment(comentId, owner);
  }
}

module.exports = DeleteCommentUseCase;
