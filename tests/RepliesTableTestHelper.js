const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReplies({
    id = "replies-123",
    content = "test content",
    created_at = new Date().toISOString(),
    comment_id = "comment-123",
    owner = "user-123",
    is_delete = false,
  }) {
    const query = {
      text: "INSERT INTO replies(id, content, created_at, comment_id, owner, is_delete) VALUES($1, $2, $3, $4, $5, $6)",
      values: [id, content, created_at, comment_id, owner, is_delete],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query("DELETE FROM replies WHERE 1=1");
  },

  async findRepliesById(id) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);

    return result.rows;
  },
};

module.exports = RepliesTableTestHelper;
