const GetComment = require("../GetComment");

describe("GetComment entities response", () => {
  it("should throw an error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      username: "jokowilly",
      date: "2023-05-15",
      content: "sebuah content",
      is_delete: false,
    };

    // Action & Assert
    expect(() => new GetComment(payload)).toThrowError(
      "GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw an error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 1212321,
      username: 2131,
      date: "2023-05-15",
      content: "sebuah content",
      is_delete: false,
    };

    // Action & Assert
    expect(() => new GetComment(payload)).toThrowError(
      "GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
  it("should get comment correctly when is_delete value is false ", () => {
    // Arrange
    const payload = {
      id: "1212321",
      username: "COKO",
      date: "2023-05-15",
      content: "sebuah content",
      is_delete: false,
    };

    // Action
    const result = new GetComment(payload);
    const dateConvert = new Date(payload.date).toISOString();

    // Assert
    expect(result.id).toEqual(payload.id);
    expect(result.username).toEqual(payload.username);
    expect(result.date).toEqual(dateConvert);
    expect(result.content).toEqual(payload.content);
  });
  it("should return **komentar telah dihapus** on content when is_delete value is true", () => {
    // Arrange
    const payload = {
      id: "1212321",
      username: "COKO",
      date: "2023-05-15",
      content: "sebuah content",
      is_delete: true,
    };

    // Action
    const result = new GetComment(payload);

    // Assert
    expect(result.content).toEqual("**komentar telah dihapus**");
  });
});
