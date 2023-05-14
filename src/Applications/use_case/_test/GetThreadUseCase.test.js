const GetComment = require("../../../Domains/comments/entities/GetComment");
const ThreadRepository = require("../../../Domains/thread/ThreadRepository");
const GetThread = require("../../../Domains/thread/entities/GetThread");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should orchestrating the get thread action correctly", async () => {
    // Arrange
    const thread = new GetThread({
      id: "1234",
      title: "sebuah thread",
      body: "sebuah body",
      date: "2023-05-14",
      username: "unknow",
    });
    const comment = new GetComment({
      id: "comment-_pby2_tmXV6bcvcdev8xk",
      username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
    });

    thread.comments = [comment];

    const threadId = "thread-123";
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(thread));
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    // Action
    const result = await getThreadUseCase.execute(threadId);
    // Assert
    expect(mockThreadRepository.getThread).toBeCalledWith(threadId);
    expect(result).toStrictEqual(thread);
  });
});
