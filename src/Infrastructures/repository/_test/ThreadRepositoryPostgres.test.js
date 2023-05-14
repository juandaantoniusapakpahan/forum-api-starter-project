const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const pool = require("../../database/postgres/pool");
const AddThread = require("../../../Domains/thread/entities/AddThread");
const AddedThread = require("../../../Domains/thread/entities/AddedThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTableThread();
    await CommentsTableTestHelper.cleanComment();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist add thread and return added thread correctly", async () => {
      // Arrange
      const threadPayload = new AddThread({
        title: "First Thread",
        body: "Thread is mine",
      });
      const stubIdGenerator = () => "1234"; // stub
      const fakeUserId = "user-123";

      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        stubIdGenerator
      );

      // Acction
      await threadRepository.addThread(fakeUserId, threadPayload);

      // Assert
      const result = await ThreadTableTestHelper.findThreadById("thread-1234");
      expect(result.length).toEqual(1);
    });

    it("should return addedThread  correctly", async () => {
      // Arrange
      const payload = new AddThread({
        title: "First Thread",
        body: "do what do you wanna to do",
      });

      const stubIdGenerator = () => "1234"; // stub
      const fakeUserId = "user-123";
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        stubIdGenerator
      );

      // Action
      const addedThred = await threadRepository.addThread(fakeUserId, payload);

      // Assert
      expect(addedThred).toStrictEqual(
        new AddedThread({
          id: "thread-1234",
          title: "First Thread",
          owner: "user-123",
        })
      );
    });
  });

  describe("checkThread function", () => {
    it("should throw an error when thread id did not found", async () => {
      // Arrange
      const threadId = "unknow-1234";
      await ThreadTableTestHelper.addThread({ id: "thread-123" });
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepository.checkThread(threadId)).rejects.toThrow(
        NotFoundError
      );
      await expect(threadRepository.checkThread(threadId)).rejects.toThrowError(
        "thread not found"
      );
    });

    it("should not throw an error when thread id was found", async () => {
      // Arrange
      const threadId = "thread-123";
      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({});

      // Action & Assert
      await expect(threadRepository.checkThread(threadId)).resolves.not.toThrow(
        NotFoundError
      );
    });
  });

  describe("getThreads function", () => {
    it("should throw an error when thread not found", async () => {
      // Arrange
      const threadId = "thread-unknow";
      await ThreadTableTestHelper.addThread({});
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await CommentsTableTestHelper.addComment({ thread_id: threadId });
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepository.getThread(threadId)).rejects.toThrow(
        NotFoundError
      );
      await expect(threadRepository.getThread(threadId)).rejects.toThrowError(
        "thread not found"
      );
    });

    it("should not throw NotFoundError when thread found", async () => {
      // Arrange
      const threadId = "thread-123";
      await ThreadTableTestHelper.addThread({ id: threadId });
      await UsersTableTestHelper.addUser({ id: "user-123" });
      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({ thread_id: threadId });

      // Action
      const thread = await threadRepository.getThread(threadId);

      // Assert
      expect(thread).not.toEqual(null);
      expect(thread.id).not.toEqual(null);
      expect(thread.username).not.toEqual(null);
    });
  });
});
