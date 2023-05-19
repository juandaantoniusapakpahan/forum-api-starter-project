const DeleteRepliesUseCase = require("../DeleteRepliesUseCase");
const ThreadRepository = require("../../../Domains/thread/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const RepliesRepository = require("../../../Domains/replies/RepliesRepository");

describe("DeleteRepliesUseCase", () => {
  it("should orchestrating the delete replies action correctly", async () => {
    // Arrange
    const threadId = "thread-883";
    const commentId = "comment-343";
    const repliesId = "replies-998";
    const owner = "user-9088";

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentIsExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockRepliesRepository.verifyRepliesIsExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.isAuthorized = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockRepliesRepository.delete = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    await deleteRepliesUseCase.execute(threadId, commentId, repliesId, owner);

    expect(mockThreadRepository.checkThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentIsExists).toBeCalledWith(
      commentId
    );
    expect(mockRepliesRepository.verifyRepliesIsExists).toBeCalledWith(
      repliesId
    );
    expect(mockRepliesRepository.isAuthorized).toBeCalledWith(repliesId, owner);
    expect(mockRepliesRepository.delete).toBeCalledWith(repliesId);
  });
});
