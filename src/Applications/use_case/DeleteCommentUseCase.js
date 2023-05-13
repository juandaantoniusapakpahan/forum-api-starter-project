class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, comentId, owner) {
    await this._threadRepository.checkThread(threadId);
    return this._commentRepository.deleteComment(comentId, owner);
  }
}

module.exports = DeleteCommentUseCase;
