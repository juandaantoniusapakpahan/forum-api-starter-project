class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, content, is_delete } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete === true ? "**komentar telah dihapus**" : content;
  }

  _verifyPayload({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error("GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof content !== "string"
    ) {
      throw new Error("GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = GetComment;
