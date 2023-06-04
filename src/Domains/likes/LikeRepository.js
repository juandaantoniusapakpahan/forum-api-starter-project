class LikeRepository {
  async isLike(commentId, owner) {
    throw new Error("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getLikeCount() {
    throw new Error("LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = LikeRepository;
