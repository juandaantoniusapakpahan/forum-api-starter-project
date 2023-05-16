const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    content = "This is my first comment",
    owner = "user-123",
    created_at = new Date().toISOString(),
    thread_id = "thread-123",
  }) {
    const is_delete = false;
    const query = {
      text: "INSERT INTO comments (id, content, owner, created_at, thread_id, is_delete) VALUES ($1, $2, $3,$4, $5, $6) RETURNING id, content, owner",
      values: [id, content, owner, created_at, thread_id, is_delete],
    };
    await pool.query(query);
  },

  async cleanComment() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },

  async findById(id) {
    const query = {
      text: "SELECT id, content, owner, created_at, is_delete FROM comments where id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
};

module.exports = CommentsTableTestHelper;
