class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, comentId, owner) {
    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.isCommentOwner(comentId, owner);
    return this._commentRepository.deleteComment(comentId);
  }
}

module.exports = DeleteCommentUseCase;
