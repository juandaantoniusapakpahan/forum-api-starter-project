class GetReplies {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, username, is_delete } = payload;
    this.id = id;
    this.content = is_delete === true ? "**balasan telah dihapus**" : content;
    this.date = new Date(date).toISOString();
    this.username = username;
  }

  _verifyPayload({ id, content, date, username }) {
    if (!id || !content || !date || !username) {
      throw new Error("GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof username !== "string"
    ) {
      throw new Error("GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}
module.exports = GetReplies;
