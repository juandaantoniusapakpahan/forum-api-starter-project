const GetReplies = require("../GetReplies");

describe("GetReplies entities", () => {
  it("should throw an error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "replies-123",
      content: "this is my first content",
      date: "2023-05-18",
      is_delete: false,
    };

    // Acation & Assert
    expect(() => new GetReplies(payload)).toThrowError(
      "GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 1234,
      content: "this is my first content",
      date: "2023-05-18",
      username: "dicoding",
      is_delete: false,
    };

    // Action & Assert
    expect(() => new GetReplies(payload)).toThrowError(
      "GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should get replies correctly", () => {
    // Arrange
    const payload = {
      id: "1234",
      content: "this is my first content",
      date: "2023-05-18",
      username: "dicoding",
      is_delete: false,
    };

    // Action
    const { id, content, date, username } = new GetReplies(payload);
    const dateConvert = new Date(payload.date).toISOString();

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(dateConvert);
    expect(username).toEqual(payload.username);
  });

  it("should return **balasan telah dihapus** when replies has been deleted", () => {
    // Arrange
    const payload = {
      id: "1234",
      content: "this is my first content",
      date: "2023-05-18",
      username: "dicoding",
      is_delete: true,
    };

    // Action
    const { content } = new GetReplies(payload);

    // Assert
    expect(content).toEqual("**balasan telah dihapus**");
  });
});
