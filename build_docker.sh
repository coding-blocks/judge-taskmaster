#!/usr/bin/env bash

docker build -t codingblocks/judge-taskmaster .
docker system prune
read -p "Push ? [Press enter to continue]"
docker push codingblocks/judge-taskmaster