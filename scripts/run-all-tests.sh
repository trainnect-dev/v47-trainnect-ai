#!/bin/bash

# Run all Jest tests
echo "Running Jest tests..."
pnpm test

# If Jest tests pass, run the model tests
if [ $? -eq 0 ]; then
  echo "Jest tests passed. Running model tests..."
  node scripts/test-models.js
else
  echo "Jest tests failed. Skipping model tests."
  exit 1
fi
