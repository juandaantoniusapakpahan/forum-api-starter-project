exports.up = (pgm) => {
  pgm.addConstraint(
    "threads",
    "thread.owner_user.id",
    "FOREIGN KEY (owner) REFERENCES users(id)"
  );

  //   pgm.addConstraint(
  //     "comments",
  //     "fk_comments.owner",
  //     "FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE"
  //   );

  //   pgm.addConstraint(
  //     "comments",
  //     "fk_comments.thread_id",
  //     "FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE"
  //   );

  //   pgm.addConstraint(
  //     "replies",
  //     "fk_replies.comment_id",
  //     "FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE"
  //   );
  //   pgm.addConstraint(
  //     "replies",
  //     "fk_replies.owner",
  //     "FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE"
  //   );
};

exports.down = (pgm) => {
  pgm.dropConstraint("threads", "thread.owner_user.id");
  //   pgm.dropConstraint("comments", "fk_comments.owner");
  //   pgm.dropConstraint("comments", "fk_comments.thread_id");
  //   pgm.dropConstraint("replies", "fk_replies.comment_id");
  //   pgm.dropConstraint("replies", "fk_replies.owner");
};
