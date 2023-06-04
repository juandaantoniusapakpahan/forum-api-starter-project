const ThreadRepository = require("../../../Domains/thread/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");

describe("UpdateLikeUseCase", () => {
  it("should orchestrating updatelike action correctly", async () => {
    // Arrange
    const owner = "user-osdfj309asd";
    const commentId = "comment-adjsfoadn";
    const threadId = "thread-923uss";
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExists = jest.fn(() =>
      Promise.resolve()
    );
    mockLikeRepository.isLike = jest.fn(() => {
      Promise.resolve();
    });

    const updateLikeUseCase = new UpdateLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await updateLikeUseCase.execute(threadId, commentId, owner);

    // Assert
    expect(mockThreadRepository.checkThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentIsExists).toBeCalledWith(
      commentId
    );
    expect(mockLikeRepository.isLike).toBeCalledWith(commentId, owner);
  });
});
