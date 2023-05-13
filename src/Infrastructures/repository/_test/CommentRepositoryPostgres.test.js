const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
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
      await commentRepositoryPostgres.addComment(owner, threadId, payload);

      // Assert
      const result = await CommentsTableTestHelper.findById("comment-123");
      expect(result.length).toEqual(1);
    });
    it("should return added comment correctly", async () => {
      // Arrange
      const paylaod = new AddComment({
        content: "This is my first comment",
      });

      const fakeIdGenerator = () => "123";
      const owner = "user-123";
      const threadId = "thread-123";

      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepository.addComment(
        owner,
        threadId,
        paylaod
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: paylaod.content,
          owner: owner,
        })
      );
    });
  });

  describe("deleteComment function", () => {
    it("should throw an error when comment was not found", async () => {
      // Arrange
      const commentId = "comment-123";
      const commentRepository = new CommentRepositoryPostgres(pool, {}); // dummy

      // Acctoin & Assert
      await expect(
        commentRepository.deleteComment(commentId)
      ).rejects.toThrowError("comment not found");
      await expect(commentRepository.deleteComment(commentId)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should delete comment correctly", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentId = "comment-123";
      const commentRepository = new CommentRepositoryPostgres(pool, {}); // dummy

      // Action & assert
      await expect(
        commentRepository.deleteComment(commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("isCommentOwner function", () => {
    it("should throw an error when was not comment owner", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const owner = "user-unknow";
      const commentId = "comment-123";
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepository.isCommentOwner(commentId, owner)
      ).rejects.toThrowError("you do not have access to these resources");
      await expect(
        commentRepository.isCommentOwner(commentId, owner)
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw an error when owner delete resources", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const owner = "user-123";
      const commentId = "comment-123";
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepository.isCommentOwner(commentId, owner)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });
});
