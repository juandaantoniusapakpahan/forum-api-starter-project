const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const AddRepliesUseCase = require("../AddRepliesUseCase");
const ThreadRepository = require("../../../Domains/thread/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const RepliesRepository = require("../../../Domains/replies/RepliesRepository");
const AddReplies = require("../../../Domains/replies/entities/AddReplies");

describe("AddRepliesUseCase", () => {
  it("should orchestrating add replies action correctly", async () => {
    // Arrange
    const expectedAddedReplies = new AddedReply({
      id: "replies-123",
      content: "I don't like your comment bro",
      owner: "user-123",
    });

    const payload = {
      id: "replies-123",
      content: "I don't like your comment bro",
      owner: "user-123",
    };
    const threadId = "thread-123";
    const commentId = "comment-123";
    const owner = "user-123";
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockRepliesRepository.addReplies = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedReply({
          id: "replies-123",
          content: "I don't like your comment bro",
          owner: "user-123",
        })
      )
    );

    const addRepliesUseCase = new AddRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const result = await addRepliesUseCase.execute(
      threadId,
      commentId,
      owner,
      payload
    );

    // Assert
    expect(result).toStrictEqual(expectedAddedReplies);
    expect(mockThreadRepository.checkThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentIsExists).toBeCalledWith(
      commentId
    );
    expect(mockRepliesRepository.addReplies).toBeCalledWith(
      commentId,
      owner,
      new AddReplies({
        id: payload.id,
        content: payload.content,
        owner: payload.owner,
      })
    );
  });
});
