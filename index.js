#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const { argv } = require("process");
const YAML = require("yaml");
const matter = require("gray-matter");
const dateFormat = require("dateformat");
const appRoot = require("app-root-path");

const handleErr = (err) => {
  if (err) {
    throw err;
  }
};

const getUserConfig = () => {
  const appDir = appRoot.path;
  return path.join(appDir, "mdg.config");
};

const config = (() => {
  try {
    return require(getUserConfig());
  } catch (e) {
    console.log("default config used. You can create mdg.config.js at root");
    return require("./config");
  }
})();

const createMdFile = () => {
  if (!fs.existsSync(config.directory)) {
    fs.mkdir(config.directory, handleErr);
  }

  const fileName = argv[2] || config.fileName;

  const fileContent = fs.existsSync(config.template)
    ? fs.readFileSync(config.template, "utf8")
    : fs.readFileSync(path.join(__dirname, "defaultBlogTemplate.md"), "utf8");

  const { content: mdContent, data } = matter(fileContent);

  const builtinAttribute = config.builtinAttribute
    ? {
        ...(config.builtinAttribute.date && {
          date: dateFormat(new Date(), config.builtinAttribute.date),
        }),
      }
    : {};

  const dataAdded = YAML.stringify({ ...data, ...builtinAttribute });

  const newMd = ["---\n", dataAdded, "---\n", mdContent].join("");

  const filePath = path.join(
    config.directory,
    `${config.prefix || ""}${fileName}.md`
  );
  
  fs.writeFile(filePath, newMd, handleErr);
};

createMdFile();
