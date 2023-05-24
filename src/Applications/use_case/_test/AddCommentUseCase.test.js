const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddCommentUseCase = require("../AddCommentUseCase");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const ThreadRepository = require("../../../Domains/thread/ThreadRepository");

describe("AddCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasepayload = {
      content: "This is my first comment",
    };
    const owner = "user-123";
    const threadId = "thread-123";

    const mockAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasepayload.content,
      owner: owner,
    });

    const mockThreadrepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadrepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn(() =>
      Promise.resolve(mockAddedComment)
    );

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadrepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      owner,
      threadId,
      useCasepayload
    );

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: "comment-123",
        content: useCasepayload.content,
        owner: owner,
      })
    );

    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment(
        {
          content: useCasepayload.content,
        },
        owner,
        threadId
      ),
      owner,
      threadId
    );
    expect(mockThreadrepository.checkThread).toBeCalledWith(threadId);
  });
});
