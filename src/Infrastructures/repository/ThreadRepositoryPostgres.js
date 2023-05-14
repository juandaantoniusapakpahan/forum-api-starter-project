const AddedThread = require("../../Domains/thread/entities/AddedThread");
const ThreadRepository = require("../../Domains/thread/ThreadRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const GetThread = require("../../Domains/thread/entities/GetThread");
const GetComment = require("../../Domains/comments/entities/GetComment");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(owner, payload) {
    const { title, body } = payload;
    const id = `thread-${this._idGenerator()}`;
    const created_at = new Date().toISOString();

    const query = {
      text: "INSERT INTO threads VALUES($1,$2, $3,$4,$5) RETURNING id, title, owner",
      values: [id, title, body, owner, created_at],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async checkThread(id) {
    const query = {
      text: "SELECT id, title FROM threads WHERE id = $1",
      values: [id],
    };
    const thread = await this._pool.query(query);
    if (thread.rows.length < 1) {
      throw new NotFoundError("thread not found");
    }
  }

  async getThread(threadId) {
    const query = {
      text: `SELECT th.id, th.title, th.body, th.created_at as date, usr.username FROM threads th 
              JOIN users usr ON th.owner = usr.id WHERE th.id = $1`,
      values: [threadId],
    };

    const threadResult = await this._pool.query(query);

    if (threadResult.rows.length < 1) {
      throw new NotFoundError("thread not found");
    }
    const thread = new GetThread({ ...threadResult.rows[0] });

    // cm.content
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

    thread.comments = comments;
    return thread;
  }
}

module.exports = ThreadRepositoryPostgres;
