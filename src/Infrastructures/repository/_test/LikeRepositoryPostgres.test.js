const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("LikeRepository Implement", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanLike();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTableThread();
    await CommentsTableTestHelper.cleanComment();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("isLike functioni", () => {
    it("should add like correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-124438534",
        username: "ajifasdgaer",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-fka93239",
        owner: "user-124438534",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfioawet",
        thread_id: "thread-fka93239",
        owner: "user-124438534",
      });
      await UsersTableTestHelper.addUser({
        id: "user-9u8equweawkej",
        username: "aisjjfinasga",
      });
      const commentId = "comment-asdfioawet";
      const owner = "user-9u8equweawkej";
      const idGenerator = () => "8342";
      const likeRespositoryPostgres = new LikeRepositoryPostgres(
        pool,
        idGenerator
      );

      // Action
      await likeRespositoryPostgres.isLike(commentId, owner);

      // Assert
      const result = await LikesTableTestHelper.findLike(commentId, owner);
      expect(result.length).toEqual(1);
      expect(result[0].comment_id).toEqual(commentId);
      expect(result[0].owner).toEqual(owner);
      expect(result[0].is_like).toEqual(true);
    });
    it("should update like to dislike correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-124438534",
        username: "ajifasdgaer",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-fka93239",
        owner: "user-124438534",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfioawet",
        thread_id: "thread-fka93239",
        owner: "user-124438534",
      });
      const commentId = "comment-asdfioawet";
      const owner = "user-124438534";
      await LikesTableTestHelper.updateLike({
        comment_id: commentId,
        owner: owner,
      });
      const likeRespositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRespositoryPostgres.isLike(commentId, owner);

      // Assert
      const result = await LikesTableTestHelper.findLike(commentId, owner);
      expect(result[0].is_like).toEqual(false);
    });

    it("should udate dislike to like correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-124438534",
        username: "ajifasdgaer",
      });
      await ThreadTableTestHelper.addThread({
        id: "thread-fka93239",
        owner: "user-124438534",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-asdfioawet",
        thread_id: "thread-fka93239",
        owner: "user-124438534",
      });
      const commentId = "comment-asdfioawet";
      const owner = "user-124438534";
      await LikesTableTestHelper.updateLike({
        comment_id: commentId,
        owner: owner,
      });
      const likeRespositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRespositoryPostgres.isLike(commentId, owner);
      await likeRespositoryPostgres.isLike(commentId, owner);

      // Assert
      const result = await LikesTableTestHelper.findLike(commentId, owner);
      expect(result[0].is_like).toEqual(true);
    });
  });
});
