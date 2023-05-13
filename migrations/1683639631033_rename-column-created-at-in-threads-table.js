/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.renameColumn("threads", "crated_at", "created_at");
};
