export default {
  defaultTemplate: 'blog',
  globalVariables: {
    author: 'Shunta Uehara',
    siteUrl: 'https://example.com',
  },
  templates: {
    blog: {
      fileName: '{{date}}-{{slug}}',
      directory: 'blog',
      template: './templates/blog.md',
      variables: {
        category: 'general',
      },
      prompts: {
        title: {
          type: 'input',
          message: 'Blog post title:',
        },
        tags: {
          type: 'input',
          message: 'Tags (comma-separated):',
        },
        category: {
          type: 'list',
          message: 'Category:',
          choices: ['general', 'tech', 'life'],
        },
      },
    },
    note: {
      fileName: '{{date}}-{{slug}}',
      directory: 'notes',
      template: './templates/note.md',
      prompts: {
        title: {
          type: 'input',
          message: 'Note title:',
        },
      },
    },
  },
};