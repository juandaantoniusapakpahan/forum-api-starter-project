/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");
const BcryptPasswordHash = require("../src/Infrastructures/security/BcryptPasswordHash");
const bcrypt = require("bcrypt");

const UsersTableTestHelper = {
  async addUser({
    id = "user-123",
    username = "dicoding",
    password = "secret",
    fullname = "Dicoding Indonesia",
  }) {
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4)",
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM users WHERE 1=1");
  },

  async addUserPasswordHash({
    id = "user-1234",
    username = "dicoding123",
    password = "secret",
    fullname = "Dicoding Indonesia",
  }) {
    const bcryptPassword = new BcryptPasswordHash(bcrypt);
    const hashPassword = await bcryptPassword.hash(password);
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4)",
      values: [id, username, hashPassword, fullname],
    };

    await pool.query(query);
  },
};

module.exports = UsersTableTestHelper;
