const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanComment();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist add comment and return added comment correctly", async () => {
      // Arrange
      const payload = new AddComment({
        content: "This is my first comment",
      });
      const stubIdGenator = () => "123";
      const threadId = "thread-123";
      const owner = "user-123";

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        stubIdGenator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        owner,
        threadId,
        payload
      );

      // Assert
      const result = await CommentsTableTestHelper.findById("comment-123");
      expect(result.length).toEqual(1);
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: payload.content,
          owner: owner,
        })
      );
    });
  });

  describe("deleteComment function", () => {
    it("should delete comment correctly", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ is_delete: false });
      const owner = "user-123";
      const commentId = "comment-123";
      const commentRepository = new CommentRepositoryPostgres(pool, {}); // dummy

      // Action
      await commentRepository.deleteComment(commentId, owner);

      // Assert
      const comment = await CommentsTableTestHelper.findById(commentId);
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return comments", async () => {
      // Arrange
      const threadId = "thread-123";
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "testerone",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-1",
        thread_id: threadId,
        owner: "user-123",
      });

      await UsersTableTestHelper.addUser({
        id: "user-124",
        username: "testertwo",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-2",
        thread_id: threadId,
        owner: "user-124",
      });

      await UsersTableTestHelper.addUser({
        id: "user-125",
        username: "testerthree",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-3",
        thread_id: threadId,
        owner: "user-125",
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepository.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).not.toEqual(null);
      expect(comments[0].id).toEqual("comment-1");
      expect(comments[0].username).toEqual("testerone");

      expect(comments[1].id).toEqual("comment-2");
      expect(comments[1].username).toEqual("testertwo");

      expect(comments[2].id).toEqual("comment-3");
      expect(comments[2].username).toEqual("testerthree");
    });
  });

  describe("verifyCommentIsExists functoin", () => {
    it("should throw an error (NotFoundError) when comment not found", async () => {
      // Arrange
      const commentId = "comment-unknow";
      await CommentsTableTestHelper.addComment({});
      const commentRepository = new CommentRepositoryPostgres(pool, {}); // dummy

      // Actoin & Assert
      await expect(
        commentRepository.verifyCommentIsExists(commentId)
      ).rejects.toThrow(NotFoundError);
      await expect(
        commentRepository.verifyCommentIsExists(commentId)
      ).rejects.toThrowError("comment not found");
    });

    it("should not throw NotFoundError", async () => {
      // Arrange
      const commentId = "comment-123";
      await CommentsTableTestHelper.addComment({});
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepository.verifyCommentIsExists(commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("isAuthorized function", () => {
    it("should throw error(AuthorizationError) when user is not the owner of the comment", async () => {
      // Arrange
      const commentId = "comment-123";
      const owner = "user-unknow";
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: "user-123",
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepository.isAuthorized(commentId, owner)
      ).rejects.toThrow(AuthorizationError);
      await expect(
        commentRepository.isAuthorized(commentId, owner)
      ).rejects.toThrowError("you do not have access to these resources");
    });
    it("should not throw error(AuthorizationError) when user is the owner of the comment", async () => {
      // Arrange
      const commentId = "comment-123";
      const owner = "user-123";
      await CommentsTableTestHelper.addComment({ id: commentId, owner: owner });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Aciton & Assert
      await expect(
        commentRepository.isAuthorized(commentId, owner)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });
});
