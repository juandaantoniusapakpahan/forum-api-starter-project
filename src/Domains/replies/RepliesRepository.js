class RepliesRepository {
  async addReplies(commentId, owner, payload) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
  async getReplies(threadId) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
  async isAuthorized(repliesId, owner) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
  async verifyRepliesIsExists(repliesId) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
  async delete(repliesId) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = RepliesRepository;
