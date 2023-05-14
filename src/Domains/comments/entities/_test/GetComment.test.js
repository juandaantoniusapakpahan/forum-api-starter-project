const GetComment = require("../GetComment");

describe("GetComment entities response", () => {
  it("should throw an error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      username: "jokowilly",
      date: "2023-05-15",
      content: "sebuah content",
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
    };

    // Action & Assert
    expect(() => new GetComment(payload)).toThrowError(
      "GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
  it("should get comment correctly", () => {
    // Arrange
    const paylaod = {
      id: "1212321",
      username: "COKO",
      date: "2023-05-15",
      content: "sebuah content",
    };

    // Action
    const result = new GetComment(paylaod);

    // Assert
    expect(result.id).toEqual(paylaod.id);
    expect(result.username).toEqual(paylaod.username);
    expect(result.date).toEqual(paylaod.date);
    expect(result.content).toEqual(paylaod.content);
  });
});
