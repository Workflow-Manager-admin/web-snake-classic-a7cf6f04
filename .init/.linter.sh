#!/bin/bash
cd /tmp/kavia/workspace/code-generation/web-snake-classic-a7cf6f04/snake_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

