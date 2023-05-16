const AddedReply = require("../AddedReply");

describe("AddedReply entities", () => {
  it("should throw an error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "replies-123",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 1234,
      content: "Hello everybody",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should return addedreply correctly", () => {
    // Arrange
    const payload = {
      id: "replies-123",
      content: "hello everybody",
      owner: "user-123",
    };

    // Action
    const { id, content, owner } = new AddedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
