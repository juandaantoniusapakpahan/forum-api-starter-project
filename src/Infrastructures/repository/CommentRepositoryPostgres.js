const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(owner, threadId, payload) {
    const content = payload.content;
    const id = `comment-${this._idGenerator()}`;
    let created_at = new Date().toISOString();
    const is_delete = false;

    const query = {
      text: "INSERT INTO comments (id, content, owner, created_at, thread_id, is_delete) VALUES ($1, $2, $3,$4, $5, $6) RETURNING id, content, owner",
      values: [id, content, owner, created_at, threadId, is_delete],
    };
    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const id_delete = true;
    const query = {
      text: "update comments set is_delete = $1 where id = $2 returning id, content",
      values: [id_delete, commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length < 1) {
      throw new NotFoundError("comment not found");
    }
  }

  async isCommentOwner(commentId, owner) {
    const query = {
      text: "SELECT id, content, owner FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    if (result.rows.length < 1) {
      throw new AuthorizationError("you do not have access to these resources");
    }
  }
}

module.exports = CommentRepositoryPostgres;
