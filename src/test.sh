#!/usr/bin/env bash

while [ true ]; do
  (( rand = RANDOM % 10 ))
  if [ $rand -lt 5 ]; then
      echo "all good"
  elif [ $rand -lt 9 ]; then
      echo "warning"
  else
      echo "error"
  fi
	sleep 1
done
