const AddedThread = require("../../Domains/thread/entities/AddedThread");
const ThreadRepository = require("../../Domains/thread/ThreadRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const GetThread = require("../../Domains/thread/entities/GetThread");

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

    return new GetThread({ ...threadResult.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
