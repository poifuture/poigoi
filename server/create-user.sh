#!/bin/bash

POUCHDB_HOST=poigoi.poiapis.com
POUCHDB_HOST=localhost:3000

AUTH_USERNAME=$1
AUTH_PASSWORD=$2
NEW_USERNAME=$3
NEW_PASSWORD=$4

NEW_USERNAME=poigoi-user-registration-service
NEW_PASSWORD=UNSAFE_PASSWORD

curl -X POST http://$POUCHDB_HOST/_session -d "name=$AUTH_USERNAME&password=$AUTH_PASSWORD"

curl -X PUT http://$POUCHDB_HOST/_users/org.couchdb.user:poigoi-user-registration-service \
     -u "$AUTH_USERNAME:$AUTH_PASSWORD" \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "'"$NEW_USERNAME"'", "password": "'"$NEW_PASSWORD"'", "roles": [], "type": "user"}'
