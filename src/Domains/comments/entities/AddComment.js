class AddComment {
  constructor(payload, owner, threadId) {
    this._verifyPayload(payload);
    this._verifyParams(owner, threadId);
    this.content = payload.content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (typeof content !== "string") {
      throw new Error("ADD_COMMENT_NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }

  _verifyParams(owner, threadId) {
    if (!owner || !threadId) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PARAMS");
    }
  }
}

module.exports = AddComment;
