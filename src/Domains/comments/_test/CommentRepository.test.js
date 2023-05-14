const CommentRepository = require("../CommentRepository");
const AddComment = require("../entities/AddComment");

describe("CommentRepository interface", () => {
  it("should throw an error when ivoke abstracts behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    const payload = {
      content: "Example",
    };
    const commentId = "comment-123";
    const owner = "user-1234";

    // Acction & Assert
    await expect(commentRepository.addComment(payload)).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.deleteComment(commentId, owner)
    ).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
