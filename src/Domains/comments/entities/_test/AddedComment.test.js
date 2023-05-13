const AddedComment = require("../AddedComment");

describe("AddedComment entities", () => {
  it("throw an error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "1234",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throw an error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 1234,
      content: "This is my first comment",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should return data addedcomment correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "This is my first comment",
      owner: "user-123",
    };

    // Action
    const { id, content, owner } = new AddedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
