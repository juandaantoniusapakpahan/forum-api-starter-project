const RepliesRepositoryPostgres = require("../RepliesRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");

describe("RepliesRepositoryPostgres", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe("addReplies function", () => {
    it("should add replies correctly", async () => {
      // Arrange
      const fakeIdGenerator = () => 123;
      const commentId = "comment-123";
      const owner = "user-123";

      const payload = {
        content: "I hate your comment",
      };
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const result = await repliesRepositoryPostgres.addReplies(
        commentId,
        owner,
        payload
      );

      // Assert
      expect(result).toStrictEqual(
        new AddedReply({
          id: "replies-123",
          content: "I hate your comment",
          owner: "user-123",
        })
      );
    });

    it("should persist add replies", async () => {
      // Arrange
      const fakeIdGenerator = () => 123;
      const commentId = "comment-123";
      const owner = "user-123";

      const payload = {
        content: "I hate your comment",
      };
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await repliesRepositoryPostgres.addReplies(commentId, owner, payload);

      // Assert
      const result = await RepliesTableTestHelper.findRepliesById(
        "replies-123"
      );
      expect(result.length).toEqual(1);
    });
  });
});
