class AddReplies {
  constructor(payload) {
    this._verifyPayload(payload);
    this.content = payload.content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error("ADD_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof content !== "string") {
      throw new Error("ADD_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddReplies;
