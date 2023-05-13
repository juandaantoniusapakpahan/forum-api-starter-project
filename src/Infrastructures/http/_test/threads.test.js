const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("/threads end point", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTableThread();
  });

  afterAll(async () => {
    await pool.end();
  });

  let token = "";

  beforeAll(async () => {
    await UsersTableTestHelper.addUserPasswordHash({ id: "user-12344" });
    const payloadAut = {
      username: "dicoding123",
      password: "secret",
    };
    const server = await createServer(container);
    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: payloadAut,
    });
    const responseJson = JSON.parse(response.payload);
    const {
      data: { accessToken },
    } = responseJson;
    token = accessToken;
    await UsersTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 401 when the user did not sign in", async () => {
      // Arrange
      const payload = {
        title: "This is my first title",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });
    it("should response 201 when thread success added", async () => {
      // Arrange
      const payload = {
        title: "My First Title",
        body: "This is my body dude",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).not.toEqual(null);
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const payload = {
        title: "My first title",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 when request payload not meet data type specificatioin", async () => {
      // Arrange
      const paylaod = {
        title: "My first title",
        body: 1234,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: paylaod,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      );
    });
  });
});
