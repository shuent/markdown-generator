const config = {
  defaultTemplate: 'blog',

  // Global variables available to all templates
  globalVariables: {
    // Common date variables
    date: () => new Date().toISOString().split('T')[0],
    datetime: () => new Date().toISOString(),
    timestamp: () => Date.now().toString(),
    year: () => new Date().getFullYear().toString(),
    month: () => String(new Date().getMonth() + 1).padStart(2, '0'),
    day: () => String(new Date().getDate()).padStart(2, '0'),

    // Your custom variables
    author: 'John Doe',
    siteUrl: 'https://example.com',
    currentYear: () => new Date().getFullYear().toString(),
    environment: () => process.env.NODE_ENV || 'development',
  },

  templates: {
    blog: {
      fileName: '{{date}}-{{slug}}',
      directory: 'content/blog',
      template: './mdg_templates/blog.md',
      variables: {
        category: 'general',
        isDraft: () => (process.env.NODE_ENV !== 'production' ? 'true' : 'false'),
      },
      prompts: {
        slug: {
          type: 'input',
          message: 'Blog post slug (URL-friendly name):',
        },
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
          choices: ['general', 'tutorial', 'announcement', 'case-study'],
        },
      },
    },

    note: {
      fileName: '{{date}}-{{slug}}',
      directory: 'notes',
      template: './mdg_templates/note.md',
      prompts: {
        slug: {
          type: 'input',
          message: 'Note slug:',
        },
        title: {
          type: 'input',
          message: 'Note title:',
        },
        type: {
          type: 'list',
          message: 'Note type:',
          choices: ['meeting', 'idea', 'todo', 'research'],
        },
      },
    },

    documentation: {
      fileName: '{{slug}}',
      directory: 'docs/{{section}}',
      template: './mdg_templates/doc.md',
      prompts: {
        slug: {
          type: 'input',
          message: 'Documentation slug:',
        },
        title: {
          type: 'input',
          message: 'Documentation title:',
        },
        section: {
          type: 'list',
          message: 'Documentation section:',
          choices: ['guides', 'api', 'tutorials', 'reference'],
          default: 'guides',
        },
        features: {
          type: 'checkbox',
          message: 'Include sections:',
          choices: ['overview', 'installation', 'usage', 'api-reference', 'examples'],
        },
      },
    },

    daily: {
      fileName: '{{date}}',
      directory: 'journal/{{year}}/{{month}}',
      template: './mdg_templates/daily.md',
      variables: {
        dayOfWeek: () => new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        time: () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
      prompts: {
        mood: {
          type: 'list',
          message: 'How are you feeling today?',
          choices: ['😊 Great', '😌 Good', '😐 Okay', '😔 Not great', '😢 Difficult'],
        },
        gratitude: {
          type: 'input',
          message: 'What are you grateful for today?',
        },
      },
    },
  },
};

export default config;
