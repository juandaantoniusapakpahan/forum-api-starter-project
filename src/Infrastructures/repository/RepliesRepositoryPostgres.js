const RepliesRepository = require("../../Domains/replies/RepliesRepository");
const AddedReply = require("../../Domains/replies/entities/AddedReply");

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplies(commentId, owner, payload) {
    const content = payload.content;
    const id = `replies-${this._idGenerator()}`;
    const created_at = new Date().toISOString();
    const is_delete = false;

    const query = {
      text: "INSERT INTO replies(id, content, created_at, comment_id, owner, is_delete) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
      values: [id, content, created_at, commentId, owner, is_delete],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }
}

module.exports = RepliesRepositoryPostgres;
