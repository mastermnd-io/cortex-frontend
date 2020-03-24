#!/bin/bash

PORTNUM=$1

echo "Building Container"
docker build -t hugo-server .

sleep 2

echo "Starting Hugo"
CONTAINER=$(docker run -itd -p $PORTNUM:1313 --mount type=bind,source="$(pwd)"/content,target=/app/content hugo-server)

RUNNINGPORT=$(docker port $CONTAINER | awk '{split($0,a,":");print a[2]}') 

echo "You can access you site at http://localhost:$RUNNINGPORT"
