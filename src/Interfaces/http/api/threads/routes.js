const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    options: {
      auth: "forumapistarterproject_jwt",
    },
    handler: handler.postThreadHandler,
  },
];

module.exports = routes;
