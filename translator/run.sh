#!/bin/bash

rm -rf ../content/*/

mkdir ./courses

node content-builder.js && cp -r ./courses/* ../content/

rmdir ./courses
