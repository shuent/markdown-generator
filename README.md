# markdown-generator
node.js based CLI md generator that Easily setup to write you markdown content. 
Especially user for JavaScript based Static site Generator such as Gatsby, Next.js.

## usage

```sh
node_module./bin mdg today_whether
# => blog/today_whether.md
```

## config
I recommend you to create `mdg.config.js` at root so that you can create default template.
Otherwise, default config inside module is used.

```js:mdg.config.js
const dateFormat = require("dateformat");

module.exports = {
  fileName: "content-title",
  directory: "blog",
  prefix: dateFormat(new Date(), "yyyy-mm-dd-"),
  template: "./template.md",
  builtinAttribute: {
    date: "yyyy-mm-dd",
  },
};
```

## Contribution
Any contribution is welcome.
