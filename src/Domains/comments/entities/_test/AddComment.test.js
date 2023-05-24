const AddComment = require("../AddComment");

describe("AddComment entities", () => {
  it("should throw an error when payload not contain needed property", () => {
    // Arrange
    const payload = {};
    const owner = "user-test";
    const threadId = "thread-123";

    // Action && Assert
    expect(() => new AddComment(payload, owner, threadId)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload not meet data type specificatoin", () => {
    // Arrange
    const payload = {
      content: 1234,
    };
    const owner = "user-test";
    const threadId = "thread-123";

    // Action & Assert
    expect(() => new AddComment(payload, owner, threadId)).toThrowError(
      "ADD_COMMENT_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should return add data comment correctly", () => {
    // Arrange
    const commentPayload = {
      content: "RRQ Lembek",
    };
    const owner = "user-test";
    const threadId = "thread-123";

    // Action
    const { content } = new AddComment(commentPayload, owner, threadId);

    // Assert
    expect(content).toEqual(commentPayload.content);
  });

  it("should return an error when owner or threadId param there is no", () => {
    // Arrange
    const commentPayload = {
      content: "RRQ Lembek",
    };
    const threadId = "thread-iasdw23";
    const owner = "";

    // Action & Assert

    expect(() => new AddComment(commentPayload, owner, threadId)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PARAMS"
    );
  });
});
