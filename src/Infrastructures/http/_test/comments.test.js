const { payload } = require("@hapi/hapi/lib/validation");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

describe("/comment end point", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanComment();
  });

  afterAll(async () => {
    await pool.end();
  });

  let token = "";

  beforeAll(async () => {
    const payload = {
      username: "dicoding123",
      password: "secret",
    };
    // Add Thread
    await ThreadTableTestHelper.addThread({});

    // Add user
    await UsersTableTestHelper.addUserPasswordHash({
      id: "user-12345",
      username: payload.username,
      password: payload.password,
    });

    const server = await createServer(container);

    // Login
    const loginResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: payload,
    });

    const loginResponseJson = JSON.parse(loginResponse.payload);
    const {
      data: { accessToken },
    } = loginResponseJson;
    token = accessToken;

    await UsersTableTestHelper.cleanTable();
  });

  describe("POST /threads/{threadId}/comments", () => {
    it("", async () => {
      // Arrange
      const payload = {
        content: "This is my first comment",
      };
      const server = await createServer(container);
      const threadId = "thread-123";

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).not.toEqual(null);
    });

    it("should throw an error when payload did not contain needed property", async () => {
      // Arrange
      const requesPayload = {};
      const server = await createServer(container);
      const threadId = "thread-123";

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requesPayload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada"
      );
    });
    it("should throw an error when paylaod did not meet data type specification", async () => {
      // Arrange
      const requesPayload = {
        content: 1231,
      };
      const threadId = "thread-123";
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requesPayload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat comment baru karena tipe data tidak sesuai"
      );
    });
    it("should throw an error when threa did not found", async () => {
      // Arrange
      const requesPayload = {
        content: "This is my first comment",
      };
      const threadId = "unknow-123";
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requesPayload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread not found");
    });
  });
});
