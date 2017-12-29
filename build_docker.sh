#!/usr/bin/env bash
npm install -D
npm run build

docker build -t codingblocks/judge-taskmaster .
docker system prune -f

read -p "Push ? [Press enter to continue]"
docker push codingblocks/judge-taskmaster