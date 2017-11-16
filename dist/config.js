exports = module.exports = {
    AMQP: {
        HOST: "localhost",
        PORT: "5672"
    },
    RUNBOX: {
        DIR: "/tmp/runbox"
    },
    LANGS: {
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
};
//# sourceMappingURL=config.js.map