const AddedThread = require("../AddedThread");

describe("AddedThread entities", () => {
  it("should throw an error when payload not contain needed property", () => {
    // Arrange
    const threadPayload = {
      id: "sdfjasfs",
      title: "wruwj",
    };

    // Action & Assert
    expect(() => new AddedThread(threadPayload)).toThrowError(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload not meet data type specificatoin", () => {
    // Arrange
    const threadPayload = {
      id: 12334234,
      title: "Added Thread",
      owner: {},
    };

    // Action & Assert
    expect(() => new AddedThread(threadPayload)).toThrowError(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should return addedThread correctly", () => {
    // Arrange
    const threadPayload = {
      id: "121231",
      title: "Added Thread",
      owner: "use-GGWP1213",
    };

    // Action
    const addedThread = new AddedThread(threadPayload);

    // Assert
    expect(addedThread.id).toEqual(threadPayload.id);
    expect(addedThread.title).toEqual(threadPayload.title);
    expect(addedThread.owner).toEqual(threadPayload.owner);
  });
});
