exports = module.exports = {
  AMQP: {
    USER: process.env.AMQP_USER || 'codingblocks',
    PASS: process.env.AMQP_PASS || 'codingblocks',
    HOST: process.env.AMQP_HOST || "localhost",
    PORT: process.env.AMQP_PORT || "5672"
  },
  RUNBOX: {
    DIR: process.env.RUNBOX_DIR || "/tmp/runbox"
  },
  LANGS: {
    'java8': {
      SOURCE_FILE: 'Main.java',
      CPU_SHARE: '1.2',
      MEM_LIMIT: '500m',
    },
    'cpp': {
      SOURCE_FILE: 'source.cpp',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '200m',
    },
    'c': {
      SOURCE_FILE: 'source.c',
      CPU_SHARE: "0.5",
      MEM_LIMIT: '100m'
    },
    'py2': {
      SOURCE_FILE: 'source.py',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '200m'
    },
    'nodejs6': {
      SOURCE_FILE: 'source.js',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '300m'
    }
  }
}