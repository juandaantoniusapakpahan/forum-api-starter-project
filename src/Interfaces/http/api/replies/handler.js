const AddRepliesUseCase = require("../../../../Applications/use_case/AddRepliesUseCase");
const DeleteRepliesUseCase = require("../../../../Applications/use_case/DeleteRepliesUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postRepliesHandler = this.postRepliesHandler.bind(this);
    this.putRepliesHandler = this.putRepliesHandler.bind(this);
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

  async putRepliesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteRepliesUseCase = this._container.getInstance(
      DeleteRepliesUseCase.name
    );
    await deleteRepliesUseCase.execute(
      threadId,
      commentId,
      replyId,
      credentialId
    );
    return {
      status: "success",
    };
  }
}

module.exports = RepliesHandler;
