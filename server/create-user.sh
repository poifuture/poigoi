#!/bin/bash

AUTH_USERNAME=$1
AUTH_PASSWORD=$2
NEW_USERNAME=$3
NEW_PASSWORD=$4

# NEW_USERNAME=poigoi-user-registration-service

curl -X POST http://pouchdb.poigoi.poiapis.com:5984/_session -d "name=$AUTH_USERNAME&password=$AUTH_PASSWORD"

curl -X PUT http://pouchdb.poigoi.poiapis.com:5984/_users/org.couchdb.user:poigoi-user-registration-service \
     -u "$AUTH_USERNAME:$AUTH_PASSWORD" \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "' "$NEW_USERNAME" '", "password": "' "$NEW_PASSWORD" '", "roles": [], "type": "user"}'
