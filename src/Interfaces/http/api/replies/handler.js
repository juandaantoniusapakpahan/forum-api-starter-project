const AddRepliesUseCase = require("../../../../Applications/use_case/AddRepliesUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postRepliesHandler = this.postRepliesHandler.bind(this);
  }

  async postRepliesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addRepliesUseCase = this._container.getInstance(
      AddRepliesUseCase.name
    );
    const addedReply = await addRepliesUseCase.execute(
      threadId,
      commentId,
      credentialId,
      request.payload
    );

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = RepliesHandler;
