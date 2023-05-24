const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const GetComment = require("../../Domains/comments/entities/GetComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payload, owner, threadId) {
    const content = payload.content;
    const id = `comment-${this._idGenerator()}`;
    let created_at = new Date().toISOString();
    const is_delete = false;

    const query = {
      text: "INSERT INTO comments (id, content, owner, created_at, thread_id, is_delete) VALUES ($1, $2, $3,$4, $5, $6) RETURNING id, content, owner",
      values: [id, content, owner, created_at, threadId, is_delete],
    };
    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async verifyCommentIsExists(commentId) {
    const query = {
      text: "SELECT * FROM comments where id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length < 1) {
      throw new NotFoundError("comment not found");
    }
  }

  async deleteComment(commentId, owner) {
    const id_delete = true;

    const query = {
      text: "update comments set is_delete = $1 where id = $2 AND owner= $3 returning id, content",
      values: [id_delete, commentId, owner],
    };

    await this._pool.query(query);
  }

  async isAuthorized(commentId, owner) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length < 1) {
      throw new AuthorizationError("you do not have access to these resources");
    }
  }

  async getCommentsByThreadId(threadId) {
    const commentQuery = {
      text: `SELECT cm.id, usr.username, cm.created_at as date, content, is_delete
      FROM comments cm
      JOIN users usr ON cm.owner = usr.id WHERE thread_id = $1
      ORDER BY cm.created_at ASC`,
      values: [threadId],
    };

    const commentQueryResult = await this._pool.query(commentQuery);
    let commentResult = commentQueryResult.rows;

    let comments = commentResult.map((comment) => {
      return new GetComment({ ...comment });
    });

    return comments;
  }
}

module.exports = CommentRepositoryPostgres;
