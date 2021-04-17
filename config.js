const dateFormat = require("dateformat");

module.exports = {
  fileName: "content-title",
  directory: "blog",
  prefix: dateFormat(new Date(), "yyyy-mm-dd-"),
  template: "./blogTemplate.md",
  builtinAttribute: {
    date: "yyyy-mm-dd",
  },
};
