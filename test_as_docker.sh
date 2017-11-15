#!/usr/bin/env bash

docker run \
    --rm \
    -v /tmp/runbox:/tmp/runbox \
    -v /var/run/docker.sock:/var/run/docker.sock \
    codingblocks/judge-taskmaster \
    npm test
