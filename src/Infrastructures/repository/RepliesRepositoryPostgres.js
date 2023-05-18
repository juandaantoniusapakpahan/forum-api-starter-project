const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
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

  async getReplies(threadId) {
    const query = {
      text: `SELECT rp.id, rp.content, rp.created_at date, usr.username, rp.is_delete, rp.comment_id FROM replies rp
      LEFT JOIN comments cm ON rp.comment_id = cm.id
      LEFT JOIN users usr ON rp.owner = usr.id 
      WHERE cm.thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async isAuthorized(repliesId, owner) {
    const query = {
      text: "SELECT * FROM replies WHERE id=$1 AND owner = $2",
      values: [repliesId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length < 1) {
      throw new AuthorizationError("you do not have access to these resources");
    }
  }

  async verifyRepliesIsExists(repliesId) {
    const query = {
      text: "SELECT * FROM replies WHERE id=$1",
      values: [repliesId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length < 1) {
      throw new NotFoundError("replies not found");
    }
  }

  async delete(repliesId) {
    const is_delete = true;
    const query = {
      text: "UPDATE replies SET is_delete = $1 WHERE id = $2",
      values: [is_delete, repliesId],
    };

    await this._pool.query(query);
  }
}

module.exports = RepliesRepositoryPostgres;
