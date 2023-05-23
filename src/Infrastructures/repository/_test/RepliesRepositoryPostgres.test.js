const RepliesRepositoryPostgres = require("../RepliesRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("RepliesRepositoryPostgres", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTableThread();
    await CommentsTableTestHelper.cleanComment();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe("addReplies function", () => {
    it("should add replies correctly", async () => {
      // Arrange
      const fakeIdGenerator = () => 123;
      const commentId = "comment-asdfnasg";
      const owner = "user-asdfasdf";

      await UsersTableTestHelper.addUser({
        id: "user-asdfasdf",
        username: "ssdfngnb",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdfasd",
        owner: "user-asdfasdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-adfkweds",
        username: "asdnmkansd",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfnasg",
        thread_id: "thread-sdfasd",
        owner: "user-adfkweds",
      });

      const payload = {
        content: "I hate your comment",
      };
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const result = await repliesRepositoryPostgres.addReplies(
        commentId,
        owner,
        payload
      );

      // Assert
      expect(result).toStrictEqual(
        new AddedReply({
          id: "replies-123",
          content: "I hate your comment",
          owner: "user-asdfasdf",
        })
      );
    });

    it("should persist add replies", async () => {
      // Arrange
      const fakeIdGenerator = () => 123;
      const commentId = "comment-asdfnasg";
      const owner = "user-asdfasdf";

      await UsersTableTestHelper.addUser({
        id: "user-asdfasdf",
        username: "ssdfngnb",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdfasd",
        owner: "user-asdfasdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-adfkweds",
        username: "asdnmkansd",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfnasg",
        thread_id: "thread-sdfasd",
        owner: "user-adfkweds",
      });

      const payload = {
        content: "I hate your comment",
      };
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await repliesRepositoryPostgres.addReplies(commentId, owner, payload);

      // Assert
      const result = await RepliesTableTestHelper.findRepliesById(
        "replies-123"
      );
      expect(result.length).toEqual(1);
    });
  });

  describe("getReplies function", () => {
    it("should return replies correctly", async () => {
      // Arrange
      const repliesRepository = new RepliesRepositoryPostgres(pool, {});
      const threadId = "thread-sdfasd";

      await UsersTableTestHelper.addUser({
        id: "user-asdfasdf",
        username: "ssdfngnb",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdfasd",
        owner: "user-asdfasdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-adfkweds",
        username: "asdnmkansd",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfnasg",
        thread_id: "thread-sdfasd",
        owner: "user-adfkweds",
      });

      await RepliesTableTestHelper.addReplies({
        id: "replies-asdfnasd",
        comment_id: "comment-asdfnasg",
        owner: "user-asdfasdf",
      });

      // Action
      const replies = await repliesRepository.getReplies(threadId);

      expect(replies[0].id).toEqual("replies-asdfnasd");
      expect(replies[0].username).toEqual("ssdfngnb");
    });
  });

  describe("isAuthorized function", () => {
    it("should throw an error when user is not owner", async () => {
      // Arrange
      const repliesId = "replies-asdfnasd";
      const owner = "user-adfkweds";
      await UsersTableTestHelper.addUser({
        id: "user-asdfasdf",
        username: "ssdfngnb",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdfasd",
        owner: "user-asdfasdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-adfkweds",
        username: "asdnmkansd",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfnasg",
        thread_id: "thread-sdfasd",
        owner: "user-adfkweds",
      });

      await RepliesTableTestHelper.addReplies({
        id: "replies-asdfnasd",
        comment_id: "comment-asdfnasg",
        owner: "user-asdfasdf",
      });
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        repliesRepositoryPostgres.isAuthorized(repliesId, owner)
      ).rejects.toThrow(AuthorizationError);

      await expect(
        repliesRepositoryPostgres.isAuthorized(repliesId, owner)
      ).rejects.toThrowError("you do not have access to these resources");
    });

    it("should not throw error when user is owner", async () => {
      // Arrange
      const repliesId = "replies-asdfnasd";
      const owner = "user-asdfasdf";
      await UsersTableTestHelper.addUser({
        id: "user-asdfasdf",
        username: "ssdfngnb",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdfasd",
        owner: "user-asdfasdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-adfkweds",
        username: "asdnmkansd",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfnasg",
        thread_id: "thread-sdfasd",
        owner: "user-adfkweds",
      });

      await RepliesTableTestHelper.addReplies({
        id: "replies-asdfnasd",
        comment_id: "comment-asdfnasg",
        owner: "user-asdfasdf",
      });
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(
        repliesRepositoryPostgres.isAuthorized(repliesId, owner)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("verifyRepliesIsExists function", () => {
    it("should throw an error when replies not found", async () => {
      // Arrange
      const repliesId = "replies-555";
      await UsersTableTestHelper.addUser({
        id: "user-asdfasdf",
        username: "ssdfngnb",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdfasd",
        owner: "user-asdfasdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-adfkweds",
        username: "asdnmkansd",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfnasg",
        thread_id: "thread-sdfasd",
        owner: "user-adfkweds",
      });

      await RepliesTableTestHelper.addReplies({
        id: "replies-asdfnasd",
        comment_id: "comment-asdfnasg",
        owner: "user-asdfasdf",
      });
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        repliesRepositoryPostgres.verifyRepliesIsExists(repliesId)
      ).rejects.toThrow(NotFoundError);
      await expect(
        repliesRepositoryPostgres.verifyRepliesIsExists(repliesId)
      ).rejects.toThrowError("replies not found");
    });

    it("should not throw an error when replies found", async () => {
      // Arrange
      const repliesId = "replies-asdfnasd";
      await UsersTableTestHelper.addUser({
        id: "user-asdfasdf",
        username: "ssdfngnb",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdfasd",
        owner: "user-asdfasdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-adfkweds",
        username: "asdnmkansd",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfnasg",
        thread_id: "thread-sdfasd",
        owner: "user-adfkweds",
      });

      await RepliesTableTestHelper.addReplies({
        id: "replies-asdfnasd",
        comment_id: "comment-asdfnasg",
        owner: "user-asdfasdf",
      });
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(
        repliesRepositoryPostgres.verifyRepliesIsExists(repliesId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("delete function", () => {
    it("should delete replies correctly", async () => {
      // Arrange
      const repliesId = "replies-asdfnasd";
      await UsersTableTestHelper.addUser({
        id: "user-asdfasdf",
        username: "ssdfngnb",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-sdfasd",
        owner: "user-asdfasdf",
      });
      await UsersTableTestHelper.addUser({
        id: "user-adfkweds",
        username: "asdnmkansd",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfnasg",
        thread_id: "thread-sdfasd",
        owner: "user-adfkweds",
      });

      await RepliesTableTestHelper.addReplies({
        id: "replies-asdfnasd",
        comment_id: "comment-asdfnasg",
        owner: "user-asdfasdf",
      });
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

      // Action
      await repliesRepositoryPostgres.delete(repliesId);

      // Assert
      const result = await RepliesTableTestHelper.findRepliesById(repliesId);
      expect(result[0].is_delete).toEqual(true);
    });
  });
});
