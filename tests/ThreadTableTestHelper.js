const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "Add Thread",
    body = "This first Thread",
    owner = "user-123",
  }) {
    const query = {
      text: "INSERT INTO threads(id, title, body, owner) values($1, $2, $3, $4)",
      values: [id, title, body, owner],
    };
    await pool.query(query);
  },

  async cleanTableThread() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },

  async findThreadById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const thread = await pool.query(query);
    return thread.rows;
  },
};

module.exports = ThreadTableTestHelper;
