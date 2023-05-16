const AddReplies = require("../AddReplies");

describe("AddReplies entities", () => {
  it("should throw an error when payload did not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddReplies(payload)).toThrowError(
      "ADD_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 12323,
    };

    // Action & Assert
    expect(() => new AddReplies(payload)).toThrowError(
      "ADD_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should add replies correctly", () => {
    // Arrange
    const payload = {
      content: "I don't like your statement about her",
    };

    // Action
    const { content } = new AddReplies(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
