const AddComment = require("../AddComment");

describe("AddComment entities", () => {
  it("should throw an error when payload not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action && Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload not meet data type specificatoin", () => {
    // Arrange
    const payload = {
      content: 1234,
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should return add data comment correctly", () => {
    // Arrange
    const commentPayload = {
      content: "RRQ Lembek",
    };

    // Arrange
    const { content } = new AddComment(commentPayload);
    expect(content).toEqual(commentPayload.content);
  });
});
