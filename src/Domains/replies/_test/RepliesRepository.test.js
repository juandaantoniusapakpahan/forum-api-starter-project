const RepliesRepository = require("../RepliesRepository");

describe("RepliesRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const repliesRepository = new RepliesRepository();

    // Action & Assert
    await expect(repliesRepository.addReplies("", "", {})).rejects.toThrowError(
      "REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repliesRepository.getReplies("")).rejects.toThrowError(
      "REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(repliesRepository.isAuthorized("", "")).rejects.toThrowError(
      "REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      repliesRepository.verifyRepliesIsExists("")
    ).rejects.toThrowError("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(repliesRepository.delete("")).rejects.toThrowError(
      "REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
