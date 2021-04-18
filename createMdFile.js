const fs = require("fs");
const path = require("path");
const { argv } = require("process");
const YAML = require("yaml");
const matter = require("gray-matter");
const dateFormat = require("dateformat");
const appRoot = require("app-root-path");

const DEFAULT_TEMPLATE_NAME = "defaultBlogTemplate.md";

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

const getBuiltinAttribute = (attribute) => ({
  ...(attribute.date && {
    date: dateFormat(new Date(), attribute.date),
  }),
});

const isEmpty = (obj) => {
  return !Object.keys(obj).length;
};

const createNewMd = (template, builtinAttribute = {}) => {
  const defaultMdTemplatePath = path.join(__dirname, DEFAULT_TEMPLATE_NAME);
  const fileContent = fs.existsSync(template)
    ? fs.readFileSync(template, "utf8")
    : fs.readFileSync(defaultMdTemplatePath, "utf8");
  const { content: mdContent, data: yamlData } = matter(fileContent);
  const dataAdded =
    isEmpty(yamlData) && isEmpty(builtinAttribute)
      ? ""
      : YAML.stringify({
          ...yamlData,
          ...getBuiltinAttribute(builtinAttribute),
        });
  return (newMd = ["---\n", dataAdded, "---\n", mdContent].join(""));
};

const createNewMdFilePath = (userDefinedName, fileName, directory, prefix) => {
  const newFileName = userDefinedName || fileName;
  const fileNamePrefix = prefix || "";
  return path.join(directory, `${fileNamePrefix}${newFileName}.md`);
};

const createMdFile = () => {
  if (!fs.existsSync(config.directory)) {
    fs.mkdir(config.directory, handleErr);
  }

  const newMdFilePath = createNewMdFilePath(
    argv[2],
    config.fileName,
    config.directory,
    config.prefix
  );
  const newMd = createNewMd(config.template, config.builtinAttribute);

  fs.writeFile(newMdFilePath, newMd, (err) => {
    handleErr(err);
    console.log(`content added: ${newMdFilePath}`);
  });
};

module.exports = createMdFile;
