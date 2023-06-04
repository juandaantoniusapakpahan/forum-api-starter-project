exports.up = (pgm) => {
  pgm.createTable("likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    is_like: {
      type: "bool",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "likes",
    "fk_likes.comment_id",
    "FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "likes",
    "fk_likes.owner",
    "FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("likes");
  pgm.dropConstraint("likes", "fk_likes.comment_id");
  pgm.dropConstraint("likes", "fk_likes.owner");
};
