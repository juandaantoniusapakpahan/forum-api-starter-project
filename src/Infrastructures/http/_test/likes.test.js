const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("Like route", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTableThread();
    await CommentsTableTestHelper.cleanComment();
    await LikesTableTestHelper.cleanLike();
  });
  afterAll(async () => {
    await pool.end();
  });

  async function getToken() {
    const payload = {
      username: "akdsfadgas",
      password: "supersecret",
    };

    await UsersTableTestHelper.addUserPasswordHash({
      id: "user-oaisjaasa89",
      username: payload.username,
      password: payload.password,
    });

    const server = await createServer(container);

    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: payload,
    });

    const responseJson = JSON.parse(response.payload);
    const {
      data: { accessToken },
    } = responseJson;
    return accessToken;
  }

  describe("PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should throw a error when threadId did not found", async () => {
      // Arrange
      const threadId = "thread-isjdfi";
      const commentId = "comment-dasodfa";
      const server = await createServer(container);
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual("thread not found");
    });

    it("should throw a error when commentId did not found", async () => {
      // Arrange
      const threadId = "thread-asoijwa9";
      const commentId = "comment-0a9sudia";
      await UsersTableTestHelper.addUser({
        id: "user-isaifu9asdf",
        username: "aisdfadnj",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-asoijwa9",
        owner: "user-isaifu9asdf",
      });
      const server = await createServer(container);
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual("comment not found");
    });

    it("should add like correctly", async () => {
      // Arrange
      const threadId = "thread-sdofnasdnoi9";
      const commentId = "comment-apsoiua8w";

      await UsersTableTestHelper.addUser({
        id: "user-iojas9faser",
        username: "oasidasndv",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdofnasdnoi9",
        owner: "user-iojas9faser",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-apsoiua8w",
        thread_id: "thread-sdofnasdnoi9",
        owner: "user-iojas9faser",
      });
      const server = await createServer(container);
      const token = await getToken();

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should update from like to dislike", async () => {
      // Arrange
      const threadId = "thread-sdofnasdnoi9";
      const commentId = "comment-apsoiua8w";

      await UsersTableTestHelper.addUser({
        id: "user-iojas9faser",
        username: "oasidasndv",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdofnasdnoi9",
        owner: "user-iojas9faser",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-apsoiua8w",
        thread_id: "thread-sdofnasdnoi9",
        owner: "user-iojas9faser",
      });
      const token = await getToken();

      await LikesTableTestHelper.updateLike({
        id: "like-oasefaiea98",
        comment_id: "comment-apsoiua8w",
        owner: "user-oaisjaasa89",
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
