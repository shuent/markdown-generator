# markdown-generator

node.js based CLI md generator that Easily setup to write you markdown content.
Especially user for JavaScript based Static site Generator such as Gatsby, Next.js.

## usage

```sh
node_module./bin mdg today_whether
# => create blog/2021-4-14-today_whether.md

node_module./bin mdg
# => create blog/2021-4-14-blog.md
```

Case: added command to `package.json`

```json:package.json
{
  "scripts":{
    "mdg": "mdg"
  }
}
```

```sh
npm run mdg today_whether
# => create blog/2021-4-14-today_whether.md
```

## config

I recommend you to create `mdg.config.js` at root so that you can create default template. Otherwise, default config inside module is used.

```js:mdg.config.js
const dateFormat = require("dateformat");

module.exports = {
  fileName: "blog", // required
  directory: "blog", // required
  prefix: dateFormat(new Date(), "yyyy-mm-dd-"),
  template: "./template.md",
  builtinAttribute: {
    date: "yyyy-mm-dd",
  },
};
```

### built in attribute

In addition to the template frontmatter, you can configure built in attribute that will be computed and automatically added.

For now, You can use `date` and format using this package. https://github.com/felixge/node-dateformat

For more built in attribute, please PR or create issue.

## Contribution

Any contribution is welcome.

## License

MIT
