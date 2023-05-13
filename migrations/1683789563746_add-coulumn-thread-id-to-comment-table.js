/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns("comments", {
    thread_id: {
      type: "VARCHAR(50)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("comments", "thread_id");
};
