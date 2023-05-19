const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments/{commentId}/replies endpoint", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanComment();
    await ThreadTableTestHelper.cleanTableThread();
  });

  afterAll(async () => {
    await pool.end();
  });

  let token = "";
  beforeAll(async () => {
    const payloadLogin = {
      username: "dicodingone",
      password: "secret",
    };
    await UsersTableTestHelper.addUserPasswordHash({
      id: "user-12345",
      username: "dicodingone",
      password: "secret",
    });

    const server = await createServer(container);
    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: payloadLogin,
    });

    const responseJson = JSON.parse(response.payload);
    const {
      data: { accessToken },
    } = responseJson;
    token = accessToken;
  });

  describe("POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 400 and status fail when payload did not contain needed property", async () => {
      // Arrange
      const payload = {};
      const threadId = "thread-123";
      const commentId = "comment-123";
      await UsersTableTestHelper.addUser({
        id: "user-12346",
        username: "dicodingtwo",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-12345",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        thread_id: "thread-123",
        owner: "user-12346",
      });
      const server = await createServer(container);

      // Aciton
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat replies baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 and status fail when payload did not meet data type specifications", async () => {
      // Arrange
      const payload = { content: 1234 };
      const threadId = "thread-123";
      const commentId = "comment-123";
      await UsersTableTestHelper.addUser({
        id: "user-12346",
        username: "dicodingtwo",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-12345",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        thread_id: "thread-123",
        owner: "user-12346",
      });
      const server = await createServer(container);

      // Aciton
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: payload,
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

    it("should response 404 and status fail when thread not found", async () => {
      // Arrange
      const payload = {
        content: "I do not like your comment",
      };
      const threadId = "thread-unknow";
      const commentId = "comment-123";
      await UsersTableTestHelper.addUser({
        id: "user-12346",
        username: "papale",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-12345",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-12346",
      });

      const server = await createServer(container);

      // Aciton
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread not found");
    });

    it("should response 404 and status fail when comment not found", async () => {
      // Arrange
      const payload = {
        content: "I do not like your comment",
      };
      const threadId = "thread-123";
      const commentId = "comment-unknow";
      await UsersTableTestHelper.addUser({
        id: "user-12346",
        username: "papale",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-12345",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-12346",
      });

      const server = await createServer(container);

      // Aciton
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("comment not found");
    });

    it("should response 201 and persisted add replies", async () => {
      // Arrange
      const payload = {
        content: "I do not like your comment",
      };
      const threadId = "thread-123";
      const commentId = "comment-123";
      await UsersTableTestHelper.addUser({
        id: "user-12346",
        username: "papale",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-12345",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-12346",
      });

      const server = await createServer(container);

      // Aciton
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const {
        data: { addedReply },
      } = responseJson;
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(addedReply).toBeDefined(); // .toBeDefined to check that a variable is not undefined
    });
  });

  describe("DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    it("should response 404 and status fail when thread not found", async () => {
      // Arrange
      const threadId = "thread-2323";
      const commentId = "comment-4432";
      const replyId = "replies-9980";
      await ThreadTableTestHelper.addThread({ id: "thread-7743" });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread not found");
    });

    it("should response 404 and status fail when comment not found", async () => {
      // Arrange
      const threadId = "thread-2323";
      const commentId = "comment-4432";
      const replyId = "replies-9980";
      await ThreadTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: "comment-3204" });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("comment not found");
    });

    it("should response 404 and status fail when replies not found", async () => {
      // Arrange
      const threadId = "thread-2323";
      const commentId = "comment-4432";
      const replyId = "replies-9980";
      await ThreadTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread_id: threadId,
      });
      await RepliesTableTestHelper.addReplies({ id: "replies-8343" });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("replies not found");
    });

    it("should response 403 when user is not owner", async () => {
      // Arrange
      const threadId = "thread-2323";
      const commentId = "comment-4432";
      const replyId = "replies-9980";
      await ThreadTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread_id: threadId,
      });
      await RepliesTableTestHelper.addReplies({ id: replyId });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 200 and delete reply correctly", async () => {
      // Arrange
      const threadId = "thread-2323";
      const commentId = "comment-4432";
      const replyId = "replies-9980";
      await ThreadTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread_id: threadId,
      });
      await RepliesTableTestHelper.addReplies({
        id: replyId,
        owner: "user-12345",
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
