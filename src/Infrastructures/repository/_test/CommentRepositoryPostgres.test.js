const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

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
    it("should throw an error when comment was not found", async () => {
      // Arrange
      const commentId = "comment-123";
      const owner = "user-123";
      const commentRepository = new CommentRepositoryPostgres(pool, {}); // dummy

      // Acctoin & Assert
      await expect(
        commentRepository.deleteComment(commentId, owner)
      ).rejects.toThrowError("comment not found");
      await expect(
        commentRepository.deleteComment(commentId, owner)
      ).rejects.toThrow(NotFoundError);
    });

    it("should delete comment correctly", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const owner = "user-123";
      const commentId = "comment-123";
      const commentRepository = new CommentRepositoryPostgres(pool, {}); // dummy

      // Action & assert
      await expect(
        commentRepository.deleteComment(commentId, owner)
      ).resolves.not.toThrow(NotFoundError);
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
});
