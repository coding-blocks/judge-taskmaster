exports = module.exports = {
  AMQP: {
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
      MEM_LIMIT: '80m',
    },
    'cpp': {
      SOURCE_FILE: 'source.cpp',
      CPU_SHARE: "0.8",
      MEM_LIMIT: '20m',
    },
    'c': {
      SOURCE_FILE: 'source.c',
      CPU_SHARE: "0.5",
      MEM_LIMIT: '20m'
    }
  }
}