const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
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
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  async function getToken() {
    const payloadLogin = {
      username: "dicodingone",
      password: "secret",
    };
    await UsersTableTestHelper.addUserPasswordHash({
      id: "user-123jj",
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
    return accessToken;
  }

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
        owner: "user-123jj",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        thread_id: "thread-123",
        owner: "user-12346",
      });
      const server = await createServer(container);
      const token = await getToken();

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
        owner: "user-123jj",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        thread_id: "thread-123",
        owner: "user-12346",
      });

      const server = await createServer(container);
      const token = await getToken();

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
        owner: "user-123jj",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-12346",
        thread_id: "thread-123",
      });

      const server = await createServer(container);
      const token = await getToken();

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
        owner: "user-123jj",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-12346",
        thread_id: "thread-123",
      });

      const server = await createServer(container);
      const token = await getToken();

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
        owner: "user-123jj",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-12346",
        thread_id: "thread-123",
      });

      const token = await getToken();
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
      await UsersTableTestHelper.addUser({ id: "user-93sjer" });
      await ThreadTableTestHelper.addThread({
        id: "thread-7743",
        owner: "user-93sjer",
      });
      const server = await createServer(container);
      const token = await getToken();
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
      await UsersTableTestHelper.addUser({
        id: "user-asdfjnse",
        username: "ggogsdfns",
      });
      await ThreadTableTestHelper.addThread({
        id: threadId,
        owner: "user-123jj",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-3204",
        owner: "user-asdfjnse",
        thread_id: "thread-2323",
      });
      const server = await createServer(container);
      const token = await getToken();
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
      const commentId = "comment-3204";
      const replyId = "replies-9980";
      await UsersTableTestHelper.addUser({
        id: "user-asdfjnse",
        username: "ggogsdfns",
      });
      await ThreadTableTestHelper.addThread({
        id: threadId,
        owner: "user-123jj",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-3204",
        owner: "user-asdfjnse",
        thread_id: "user-123jj",
      });
      await RepliesTableTestHelper.addReplies({
        id: "replies-8343",
        owner: "user-123jj",
        comment_id: "comment-3204",
      });
      const server = await createServer(container);
      const token = await getToken();
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
      const commentId = "comment-3204";
      const replyId = "replies-8343";

      await UsersTableTestHelper.addUser({
        id: "user-asdfjnse",
        username: "ggogsdfns",
      });
      await UsersTableTestHelper.addUser({
        id: "user-sdmsdkfns",
        username: "asseknalsng",
      });
      await ThreadTableTestHelper.addThread({
        id: threadId,
        owner: "user-123jj",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-3204",
        owner: "user-asdfjnse",
        thread_id: "user-123jj",
      });
      await RepliesTableTestHelper.addReplies({
        id: "replies-8343",
        owner: "user-sdmsdkfns",
        comment_id: "comment-3204",
      });
      const server = await createServer(container);
      const token = await getToken();
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
      const commentId = "comment-3204";
      const replyId = "replies-8343";
      await UsersTableTestHelper.addUser({
        id: "user-asdfjnse",
        username: "ggogsdfns",
      });
      await ThreadTableTestHelper.addThread({
        id: threadId,
        owner: "user-123jj",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-3204",
        owner: "user-asdfjnse",
        thread_id: "user-123jj",
      });
      await RepliesTableTestHelper.addReplies({
        id: "replies-8343",
        owner: "user-123jj",
        comment_id: "comment-3204",
      });
      const server = await createServer(container);
      const token = await getToken();
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
