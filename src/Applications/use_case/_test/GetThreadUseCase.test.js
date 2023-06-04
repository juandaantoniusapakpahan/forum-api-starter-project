const CommentRepository = require("../../../Domains/comments/CommentRepository");
const GetComment = require("../../../Domains/comments/entities/GetComment");
const RepliesRepository = require("../../../Domains/replies/RepliesRepository");
const GetReplies = require("../../../Domains/replies/entities/GetReplies");
const ThreadRepository = require("../../../Domains/thread/ThreadRepository");
const GetThread = require("../../../Domains/thread/entities/GetThread");
const GetThreadUseCase = require("../GetThreadUseCase");
const LikeRepository = require("../../../Domains/likes/LikeRepository");

describe("GetThreadUseCase", () => {
  it("should orchestrating the get thread action correctly", async () => {
    // Arrange
    const thread = new GetThread({
      id: "123",
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
    const repliesExpect = new GetReplies({
      id: "1231231",
      content: "content",
      date: "2021-08-08T07:22:33.555Z",
      username: "ggwp",
    });

    const getLikeCount = [
      { comment_id: "comment-_pby2_tmXV6bcvcdev8xk", likecount: "2" },
      { comment_id: "comment-sopdija98s", likecount: "2" },
    ];

    comment.replies = [repliesExpect];
    comment.likeCount = 2;
    thread.comments = [comment];
    const expectedValue = thread;

    const threadId = "thread-123";
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();
    const mockLikeRepository = new LikeRepository();
    mockThreadRepository.getThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new GetThread({
          id: "123",
          title: "sebuah thread",
          body: "sebuah body",
          date: "2023-05-14",
          username: "unknow",
        })
      )
    );

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          new GetComment({
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
          }),
        ])
      );
    mockRepliesRepository.getReplies = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: "1231231",
          content: "content",
          date: "2021-08-08T07:22:33.555Z",
          username: "ggwp",
          comment_id: "comment-_pby2_tmXV6bcvcdev8xk",
        },
      ])
    );
    mockLikeRepository.getLikeCount = jest
      .fn()
      .mockImplementation(() => Promise.resolve(getLikeCount));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      threadId
    );
    expect(mockRepliesRepository.getReplies).toBeCalledWith(threadId);
    expect(result).toStrictEqual(expectedValue);
  });
});
