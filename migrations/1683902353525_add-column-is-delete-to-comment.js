exports.up = (pgm) => {
  pgm.addColumn("comments", {
    is_delete: {
      type: "bool",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comments", "is_delete");
};
