const { payload, headers } = require("@hapi/hapi/lib/validation");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");

describe("/comment end point", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanComment();
    await ThreadTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  async function getToken() {
    const payload = {
      username: "dicoding123",
      password: "secret",
    };
    // Add Thread

    // Add user
    await UsersTableTestHelper.addUserPasswordHash({
      id: "user-ksfsfsdfk",
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
    return accessToken;
  }

  describe("POST /threads/{threadId}/comments", () => {
    it("should response 201 and add comment", async () => {
      // Arrange
      const payload = {
        content: "This is my first comment",
      };
      // const ownerComment = "user-ksfsfsdfk"
      await UsersTableTestHelper.addUser({
        id: "user-9aiwjknsdf",
        username: "ciamaksdk",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdnfsdll",
        owner: "user-9aiwjknsdf",
      });

      const server = await createServer(container);
      const threadId = "thread-sdnfsdll";
      const token = await getToken();

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
      await UsersTableTestHelper.addUser({
        id: "user-amdnsdf",
        username: "sdfnkajnv",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-asdmfns",
        owner: "user-amdnsdf",
      });
      const server = await createServer(container);
      const threadId = "thread-asdmfn";
      const token = await getToken();

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
    it("should throw an error when payload did not meet data type specification", async () => {
      // Arrange
      const requesPayload = {
        content: 1231,
      };
      await UsersTableTestHelper.addUser({
        id: "user-amdnsdf",
        username: "sdfnkajnv",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-asdmfns",
        owner: "user-amdnsdf",
      });
      const threadId = "thread-asdmfns";
      const server = await createServer(container);
      const token = await getToken();

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
    it("should throw an error when thread did not found", async () => {
      // Arrange
      const requesPayload = {
        content: "This is my first comment",
      };
      await UsersTableTestHelper.addUser({
        id: "user-amdnsdf",
        username: "sdfnkajnv",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-asdmfns",
        owner: "user-amdnsdf",
      });
      const threadId = "unknow-123";
      const server = await createServer(container);
      const token = await getToken();

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

  describe("DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200 and return success", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-amdnsdf",
        username: "sdfnkajnv",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-asdmfns",
        owner: "user-amdnsdf",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-aksdnjas",
        owner: "user-ksfsfsdfk",
        thread_id: "thread-asdmfns",
      });

      const server = await createServer(container);
      const threadId = "thread-asdmfns";
      const commentId = "comment-aksdnjas";
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const resopnseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(resopnseJson.status).toEqual("success");
    });
    it("should response 404 when thread not found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-amdnsdf",
        username: "sdfnkajnv",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-asdmfns",
        owner: "user-amdnsdf",
      });

      const server = await createServer(container);
      const threadId = "thread-unknow";
      const commentId = "comment-123";
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const resopnseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(resopnseJson.status).toEqual("fail");
    });

    it("should response 403 when is not comment owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-amdnsdf",
        username: "sdfnkajnvflk",
      });
      await UsersTableTestHelper.addUser({
        id: "user-amdnsdfsfb",
        username: "sdfnkajnv",
      });

      await ThreadTableTestHelper.addThread({
        id: "thread-asdmfns",
        owner: "user-amdnsdf",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfadf",
        owner: "user-amdnsdfsfb",
      });

      const server = await createServer(container);
      const threadId = "thread-asdmfns";
      const commentId = "comment-asdfadf";
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assert
      const resopnseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(resopnseJson.status).toEqual("fail");
      expect(resopnseJson.message).toEqual(
        "you do not have access to these resources"
      );
    });

    it("should response 404 when comment not found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-amdnsdf",
        username: "sdfnkajnvsdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-amdnsdfsfb",
        username: "sdfnkajnv",
      });

      await ThreadTableTestHelper.addThread({
        id: "thread-asdmfns",
        owner: "user-amdnsdf",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfadf",
        owner: "user-amdnsdfsfb",
      });
      const server = await createServer(container);
      const threadId = "thread-asdmfns";
      const commentId = "comment-unknow";
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assert
      const resopnseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(resopnseJson.status).toEqual("fail");
      expect(resopnseJson.message).toEqual("comment not found");
    });
  });
});
