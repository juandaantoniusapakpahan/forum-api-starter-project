const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    options: {
      auth: "forumapistarterproject_jwt",
    },
    handler: handler.postCommentHandler,
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    options: {
      auth: "forumapistarterproject_jwt",
    },
    handler: handler.deleteCommentHandler,
  },
];

module.exports = routes;
