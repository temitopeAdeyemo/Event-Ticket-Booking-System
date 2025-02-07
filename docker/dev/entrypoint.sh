#!/bin/bash
echo "--------------Generating migrations--------------"
yarn run migration:generate

if [ $? -ne 0 ]; then
  echo "--------------Migration generation failed. Continuing--------------"
else
  echo "--------------Applying migrations--------------"
  yarn run migration:up

  if [ $? -ne 0 ]; then
    echo "Migration up failed. Continuing..."
    exit 1
  else
    echo "Migration up completed successfully."
  fi
fi

npm run start