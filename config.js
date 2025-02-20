exports = module.exports = {
  JOB_QUEUE: process.env.JOB_QUEUE || 'job_queue' ,
  SUCCESS_QUEUE: process.env.SUCCESS_QUEUE || 'success_queue' ,
  ERROR_QUEUE: process.env.ERROR_QUEUE || 'error_queue' ,
  MAX_OUTPUT_BUFFER: 65536,
  AMQP: {
    USER: process.env.AMQP_USER || 'codingblocks',
    PASS: process.env.AMQP_PASS || 'codingblocks',
    HOST: process.env.AMQP_HOST || "localhost",
    PORT: process.env.AMQP_PORT || "5672"
  },
  SENTRY: {
    DSN: process.env.SENTRY_DSN
  },
  RUNBOX: {
    DIR: process.env.RUNBOX_DIR || "/tmp/runbox"
  },
  PROJECT: {
    'nodejs': {
      CPU_SHARE: '1.2',
      MEM_LIMIT: '500m'
    },
    'python': {
      CPU_SHARE: '1.2',
      MEM_LIMIT: '500m'
    }
  },
  LANGS: {
    'java8': {
      SOURCE_FILE: 'Main.java',
      CPU_SHARE: '1.2',
      MEM_LIMIT: '500m',
    },
    'java': {
      SOURCE_FILE: 'Main.java',
      CPU_SHARE: '1.2',
      MEM_LIMIT: '500m',
    },
    'cpp': {
      SOURCE_FILE: 'source.cpp',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '200m',
    },
    'rust': {
      SOURCE_FILE: 'script.rs',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '200m',
    },
    'golang': {
      SOURCE_FILE: 'main.go',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '200m',
    },
    'c': {
      SOURCE_FILE: 'source.c',
      CPU_SHARE: "0.5",
      MEM_LIMIT: '100m'
    },
    'csharp': {
      SOURCE_FILE: 'program.cs',
      CPU_SHARE: '1.2',
      MEM_LIMIT: '500m',
    },
    'py2': {
      SOURCE_FILE: 'script.py',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '200m'
    },
    'py3': {
      SOURCE_FILE: 'script.py',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '200m'
    },
    'nodejs8': {
      SOURCE_FILE: 'script.js',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '300m'
    },
    'nodejs10': {
      SOURCE_FILE: 'script.js',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '300m'
    },
    'ruby': {
      SOURCE_FILE: 'script.rb',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '300m'
    },
    'csv': {
      SOURCE_FILE: 'script.py',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '500m',
    },
    'kotlin': {
      SOURCE_FILE: 'Main.kt',
      CPU_SHARE: "1.2",
      MEM_LIMIT: '500m',
    },
    'mysql': {
      SOURCE_FILE: 'script.sql',
      CPU_SHARE: "1.2",
      MEM_LIMIT: '500m',
    }
  }
}
