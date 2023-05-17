const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    options: {
      auth: "forumapistarterproject_jwt",
    },
    handler: handler.postRepliesHandler,
  },
];

module.exports = routes;
