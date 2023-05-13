const AddThread = require("../../Domains/thread/entities/AddThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(id, useCasePayload) {
    const addThread = new AddThread(useCasePayload);
    return await this._threadRepository.addThread(id, addThread);
  }
}
module.exports = AddThreadUseCase;
