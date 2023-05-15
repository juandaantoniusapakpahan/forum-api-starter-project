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

  async deleteComment(commentId, owner) {
    const id_delete = true;

    const checkCommentQuery = {
      text: "SELECT * FROM comments where id = $1",
      values: [commentId],
    };

    const resultCheckComment = await this._pool.query(checkCommentQuery);

    if (resultCheckComment.rows.length < 1) {
      throw new NotFoundError("comment not found");
    }

    const query = {
      text: "update comments set is_delete = $1 where id = $2 AND owner= $3 returning id, content",
      values: [id_delete, commentId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length < 1) {
      throw new AuthorizationError("you do not have access to these resources");
    }
  }

  async getCommentsByThreadId(threadId) {
    const commentQuery = {
      text: `SELECT cm.id, usr.username, cm.created_at as date, 
      CASE 
      WHEN cm.is_delete = true then '**komentar telah dihapus**'
      WHEN cm.is_delete = false then cm.content
      END as content
      FROM comments cm
      JOIN users usr ON cm.owner = usr.id WHERE thread_id = $1
      ORDER BY cm.created_at ASC`,
      values: [threadId],
    };

    const commentQueryResult = await this._pool.query(commentQuery);

    const comments = [];
    for (let i = 0; i < commentQueryResult.rows.length; i++) {
      comments.push(new GetComment({ ...commentQueryResult.rows[i] }));
    }

    return comments;
  }
}

module.exports = CommentRepositoryPostgres;
