const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesTableTestHelper = {
  async updateLike({
    id = "like-123",
    comment_id = "comment-123",
    owner = "user-123",
    is_like = true,
  }) {
    const query = {
      text: "INSERT INTO likes (id, comment_id, owner, is_like) VALUES ($1,$2,$3,$4)",
      values: [id, comment_id, owner, is_like],
    };
    await pool.query(query);
  },
  async findLike(commentId, owner) {
    const query = {
      text: "SELECT * FROM likes WHERE comment_id = $1 AND owner=$2",
      values: [commentId, owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanLike() {
    await pool.query("DELETE FROM likes WHERE 1=1");
  },
};
module.exports = LikesTableTestHelper;
