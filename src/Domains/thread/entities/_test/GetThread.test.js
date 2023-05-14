const GetThread = require("../GetThread");

describe("GetThread entities response", () => {
  it("should throw an error when did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "This is my thread",
      body: "Just body",
      data: "2023-05-14",
      username: " Jokoko",
    };

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError(
      "GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 12323,
      title: "This is my thread",
      body: "Just body",
      date: "2023-05-14",
      username: " Jokoko",
    };

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError(
      "GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should return getthread correctly", () => {
    // Arrange
    const payload = {
      id: "12342",
      title: "This is my thread",
      body: "Just body",
      date: "2023-05-14",
      username: " Jokoko",
    };

    // Action
    const getThread = new GetThread(payload);

    // Assert
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(payload.date);
    expect(getThread.username).toEqual(payload.username);
  });
});
