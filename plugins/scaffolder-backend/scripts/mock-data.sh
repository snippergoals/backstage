#!/usr/bin/env bash

for URL in \
  'react-ssr-template' \
  'springboot-grpc-template' \
  'create-react-app' \
  'docs-template' \
; do \
  curl \
    --location \
    --request POST 'localhost:7000/catalog/locations' \
    --header 'Content-Type: application/json' \
    --data-raw "{\"type\": \"file\", \"target\": \"$(pwd)/sample-templates/${URL}/template.yaml\"}"
  echo
done

curl \
    --location \
    --request POST 'localhost:7000/catalog/locations' \
    --header 'Content-Type: application/json' \
    --data-raw "{\"type\": \"github\", \"target\": \"https://github.com/spotify/cookiecutter-golang/blob/master/template.yaml\"}"
echo
