const AddReplies = require("../../Domains/replies/entities/AddReplies");

class AddRepliesUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(threadId, commentId, owner, payload) {
    const addReplies = new AddReplies(payload);
    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.verifyCommentIsExists(commentId);
    return this._repliesRepository.addReplies(commentId, owner, addReplies);
  }
}

module.exports = AddRepliesUseCase;
