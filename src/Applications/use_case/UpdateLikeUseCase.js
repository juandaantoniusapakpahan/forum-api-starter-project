class UpdateLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.verifyCommentIsExists(commentId);
    return this._likeRepository.isLike(commentId, owner);
  }
}

module.exports = UpdateLikeUseCase;
