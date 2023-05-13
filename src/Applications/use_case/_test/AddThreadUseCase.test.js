const { payload } = require("@hapi/hapi/lib/validation");
const AddThreadUseCase = require("../AddThreadUseCase");
const AddedThread = require("../../../Domains/thread/entities/AddedThread");
const ThreadRepository = require("../../../Domains/thread/ThreadRepository");
const AddThread = require("../../../Domains/thread/entities/AddThread");

describe("AddThresUseCase", () => {
  it("should orchestrating the add user action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "title",
      body: "This is first Thread",
    };
    const owner = "user-123";
    const mockAddedThread = new AddedThread({
      id: "thread-1234",
      title: useCasePayload.title,
      owner: owner,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await addThreadUseCase.execute(owner, useCasePayload);

    // Assert
    expect(result).toStrictEqual(
      new AddedThread({
        id: "thread-1234",
        title: useCasePayload.title,
        owner: "user-123",
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      owner,
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });
});
