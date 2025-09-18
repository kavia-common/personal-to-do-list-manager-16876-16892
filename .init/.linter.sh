#!/bin/bash
cd /home/kavia/workspace/code-generation/personal-to-do-list-manager-16876-16892/to_do_list_frontend
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

