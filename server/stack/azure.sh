#!/bin/bash

PORT=80
POIGOI_POUCHDB_HOST='http://poigoi.poiapis.com'
POIGOI_USER_REGISTRATION_SERVICE_POUCHDB_PASSWORD=$1

# Change these four parameters as needed
ACI_PERS_RESOURCE_GROUP=poigoi-dev
ACI_PERS_STORAGE_ACCOUNT_NAME=poigoipouchdb
ACI_PERS_LOCATION=westus
ACI_PERS_SHARE_NAME=poigoi-pouchdb-data

# Create the storage account with the parameters
# az storage account create \
#     --resource-group $ACI_PERS_RESOURCE_GROUP \
#     --name $ACI_PERS_STORAGE_ACCOUNT_NAME \
#     --location $ACI_PERS_LOCATION \
#     --sku Standard_LRS

# Create the file share
# az storage share create --name $ACI_PERS_SHARE_NAME --account-name $ACI_PERS_STORAGE_ACCOUNT_NAME

STORAGE_KEY=$(az storage account keys list --resource-group $ACI_PERS_RESOURCE_GROUP --account-name $ACI_PERS_STORAGE_ACCOUNT_NAME --query "[0].value" --output tsv)
echo $STORAGE_KEY

az container create \
    --resource-group $ACI_PERS_RESOURCE_GROUP \
    --name poigoi-server \
    --image poifuture/poigoi-server \
    --dns-name-label poigoi-server \
    --ports 80 443 3000 \
    --azure-file-volume-account-name $ACI_PERS_STORAGE_ACCOUNT_NAME \
    --azure-file-volume-account-key $STORAGE_KEY \
    --azure-file-volume-share-name $ACI_PERS_SHARE_NAME \
    --azure-file-volume-mount-path /poigoi/data/ \
    --environment-variables 'PORT'=$PORT \
                            'POIGOI_POUCHDB_HOST'=$POIGOI_POUCHDB_HOST \
                            'POIGOI_USER_REGISTRATION_SERVICE_POUCHDB_PASSWORD'=$POIGOI_USER_REGISTRATION_SERVICE_POUCHDB_PASSWORD

                            