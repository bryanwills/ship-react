#!/bin/sh

source bin/constants.sh

npm run infra |
while read line;
do
  if [[ ${line} =~ "$DATABASE_SUCCESS_MESSAGE" ]]
    then
      echo $line
      npm run turbo-start &
    else echo $line
  fi;
done
