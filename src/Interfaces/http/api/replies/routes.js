const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    options: {
      auth: "forumapistarterproject_jwt",
    },
    handler: handler.postRepliesHandler,
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    options: {
      auth: "forumapistarterproject_jwt",
    },
    handler: handler.putRepliesHandler,
  },
];

module.exports = routes;
