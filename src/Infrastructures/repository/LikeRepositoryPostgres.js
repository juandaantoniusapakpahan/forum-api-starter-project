const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async isLike(commentId, owner) {
    const queryCheckLike = {
      text: "SELECT * FROM likes WHERE comment_id = $1 AND owner = $2",
      values: [commentId, owner],
    };
    const resultCheckLlike = await this._pool.query(queryCheckLike);

    if (resultCheckLlike.rows.length < 1) {
      const id = `like-${this._idGenerator()}`;
      const is_like = true;
      const query = {
        text: "INSERT INTO likes(id, comment_id, owner, is_like) VALUES($1,$2,$3,$4)",
        values: [id, commentId, owner, is_like],
      };
      await this._pool.query(query);
    } else {
      const is_like = resultCheckLlike.rows[0].is_like === false ? true : false;
      const query = {
        text: "UPDATE likes SET is_like = $1 WHERE comment_id = $2 AND owner=$3",
        values: [is_like, commentId, owner],
      };
      await this._pool.query(query);
    }
  }
}

module.exports = LikeRepositoryPostgres;
