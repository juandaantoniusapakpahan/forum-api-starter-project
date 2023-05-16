const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/thread/ThreadRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeletecommentUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    const owner = "user-123";
    const commentId = "comment-123";

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentIsExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.isAuthorized = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(threadId, commentId, owner);

    // Assert
    expect(mockThreadRepository.checkThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentIsExists(commentId));
    expect(mockCommentRepository.isAuthorized(commentId, owner));
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      commentId,
      owner
    );
  });
});
