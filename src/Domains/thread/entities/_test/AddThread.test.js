const AddTread = require("../AddThread");

describe("AddTread entities", () => {
  it("should throw an error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      title: "AddThread",
    };

    // Action & Assert
    expect(() => new AddTread(payload)).toThrowError(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "AddThread",
      body: 1234,
    };

    // Action & Assert
    expect(() => new AddTread(payload)).toThrowError(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should AddThread correctly", () => {
    // Arrange
    const payload = {
      title: "AddThread",
      body: "Just For Fun",
    };

    // Action
    const addThread = new AddTread(payload);

    // Assert
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.title).toEqual(payload.title);
  });
});
