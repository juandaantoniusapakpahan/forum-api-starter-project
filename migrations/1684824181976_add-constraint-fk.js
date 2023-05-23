exports.up = (pgm) => {
  pgm.addConstraint(
    "threads",
    "fk_threads.owner_user.id",
    "FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "comments",
    "fk_comments.owner_user.id",
    "FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "comments",
    "fk_comments.thread_id_thread.id",
    "FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "replies",
    "fk_replies.comment_id_comment.id",
    "FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "replies",
    "fk_replies.owner_user.id",
    "FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("threads", "fk_threads.owner_user.id");
  pgm.dropConstraint("comments", "fk_comments.owner_user.id");
  pgm.dropConstraint("comments", "fk_comments.thread_id_thread.id");
  pgm.dropConstraint("replies", "fk_replies.comment_id_comment.id");
  pgm.dropConstraint("replies", "fk_replies.owner_user.id");
};
