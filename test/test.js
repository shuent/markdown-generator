const assert = require("assert");
const rewire = require("rewire");
const path = require("path");
const fs = require("fs");

const myModule = rewire("../createMdFile.js");
const createNewMdFilePath = myModule.__get__("createNewMdFilePath");
const createNewMd = myModule.__get__("createNewMd");

describe("functions", () => {
  describe("createNewMdFilePath", () => {
    it("if no argv returns config default path", () => {
      assert.strictEqual(
        createNewMdFilePath(undefined, "filename", "dir", "prefiiix-"),
        "dir/prefiiix-filename.md"
      );
    });

    it("if argv return user defined path", () => {
      assert.strictEqual(
        createNewMdFilePath("my-slug", "filename", "dir", "prefiiix-"),
        "dir/prefiiix-my-slug.md"
      );
    });

    it("if no prefix return path", () => {
      assert.strictEqual(
        createNewMdFilePath("my-slug", "filename", "dir"),
        "dir/my-slug.md"
      );
    });
  });

  describe("createNedMd", () => {
    myModule.__set__("dateFormat", () => 2021);
    describe("if no template", () => {
      myModule.__with__({ "fs.readFileSync": () => "default" }, () => {
        it("if no template return default", () => {
          assert.strictEqual(
            createNewMd("../noTestTemplate.md", {
              date: "yyyy",
            }),
            "---\ndate: 2021\n---\ndefault"
          );
        });

        it("if no template and no buitlin attribute return default", () => {
          assert.strictEqual(
            createNewMd("../noTestTemplate.md", {}),
            "---\n---\ndefault"
          );
        });

        it("if no template and buitlin attribute is undefined return default", () => {
          assert.strictEqual(
            createNewMd("../noTestTemplate.md", undefined),
            "---\n---\ndefault"
          );
        });

        it("if no template and buitlin attribute is invalid return default", () => {
          assert.strictEqual(
            createNewMd("../noTestTemplate.md", { invalid: "attr" }),
            "---\n---\ndefault"
          );
        });
      });
    });

    it("if template has attributes", () => {
      fs.writeFileSync("./testTemplate.md", "---\ntitle: apple\n---\ndefault");
      assert.strictEqual(
        createNewMd("../testTemplate.md"),
        "---\ntitle: apple\n---\ndefault"
      );
    });

    it("if template has attributes and built in attribute", () => {
      fs.writeFileSync("./testTemplate.md", "---\ntitle: apple\n---\ndefault");
      assert.strictEqual(
        createNewMd("../testTemplate.md", {
          date: "yyyy",
        }),
        "---\ntitle: apple\ndate: 2021\n---\ndefault"
      );
      fs.rmSync("./testTemplate.md");
    });
  });
});
