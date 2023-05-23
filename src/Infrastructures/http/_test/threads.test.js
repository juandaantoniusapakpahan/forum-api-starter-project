const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");

describe("/threads end point", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTableThread();
    await CommentsTableTestHelper.cleanComment();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  async function getToken() {
    await UsersTableTestHelper.addUserPasswordHash({ id: "user-12344" });
    const payloadAut = {
      username: "dicoding123",
      password: "secret",
    };
    const server = await createServer(container);
    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: payloadAut,
    });
    const responseJson = JSON.parse(response.payload);
    const {
      data: { accessToken },
    } = responseJson;
    return accessToken;
  }

  describe("when POST /threads", () => {
    it("should response 401 when the user did not sign in", async () => {
      // Arrange
      const payload = {
        title: "This is my first title",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });
    it("should response 201 when thread success added", async () => {
      // Arrange
      const payload = {
        title: "My First Title",
        body: "This is my body dude",
      };
      const server = await createServer(container);
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).not.toEqual(null);
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const payload = {
        title: "My first title",
      };
      const server = await createServer(container);
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 when request payload not meet data type specificatioin", async () => {
      // Arrange
      const paylaod = {
        title: "My first title",
        body: 1234,
      };
      const server = await createServer(container);
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: paylaod,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      );
    });
  });

  describe("when GET /threads", () => {
    it("should response 404 when thread not found", async () => {
      // Arrange
      const threadId = "thread-unknow";
      await UsersTableTestHelper.addUser({
        id: "user-293undfjs",
        username: "asvlasgs",
      });
      await UsersTableTestHelper.addUser({
        id: "user-mdfamsn",
        username: "laknsfksn",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-skfans",
        owner: "user-293undfjs",
      });
      await CommentsTableTestHelper.addComment({
        thread_id: "thread-skfans",
        owner: "user-mdfamsn",
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread not found");
    });
    it("should response 200 and return thread detail correctly", async () => {
      // Arrange
      const threadid = "thread-dsnfjn";
      await UsersTableTestHelper.addUser({
        id: "user-asdjnsd",
        username: "asdfasdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-asdjnsasdf",
        username: "asdfasdasdf",
      });

      await ThreadTableTestHelper.addThread({
        id: "thread-dsnfjn",
        owner: "user-asdjnsd",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-sdnfjnsdf",
        thread_id: "thread-dsnfjn",
        owner: "user-asdjnsasdf",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-124",
        owner: "comment-sdnfjnsdf",
        thread_id: "thread-dsnfjn",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-125",
        owner: "comment-sdnfjnsdf",
        thread_id: "thread-dsnfjn",
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadid}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).not.toEqual(null);
      expect(responseJson.data.comments).not.toEqual(null);
    });
  });
});
