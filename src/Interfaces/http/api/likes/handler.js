const UpdateLikeUseCase = require("../../../../Applications/use_case/UpdateLikeUseCase");

class LikeHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request) {
    const updateLikeUseCase = this._container.getInstance(
      UpdateLikeUseCase.name
    );
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await updateLikeUseCase.execute(threadId, commentId, credentialId);
    return {
      status: "success",
    };
  }
}

module.exports = LikeHandler;
