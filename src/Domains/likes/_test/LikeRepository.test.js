const LikeRepository = require("../LikeRepository");

describe("likesrepository interface", () => {
  it("updateLike throw error when invoke unimplemented method", async () => {
    // Arrange
    const likesRepository = new LikeRepository();

    // Action & Arrange
    expect(likesRepository.isLike("", "")).rejects.toThrowError(
      "LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
