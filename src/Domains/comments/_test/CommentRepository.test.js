const CommentRepository = require("../CommentRepository");
const AddComment = require("../entities/AddComment");

describe("CommentRepository interface", () => {
  it("should throw an error when ivoke abstracts behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Acction & Assert
    await expect(commentRepository.addComment({})).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentRepository.deleteComment("", "")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.getCommentsByThreadId("")
    ).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
