const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    options: {
      auth: "forumapistarterproject_jwt",
    },
    handler: handler.postCommentHandler,
  },
];

module.exports = routes;
