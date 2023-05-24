const AddComment = require("../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
  async execute(owner, threadId, comentPayload) {
    const addComment = new AddComment(comentPayload, owner, threadId);
    await this._threadRepository.checkThread(threadId);

    return this._commentRepository.addComment(addComment, owner, threadId);
  }
}

module.exports = AddCommentUseCase;
