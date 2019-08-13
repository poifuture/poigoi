# Spiders

This folder contains the handy scripts to generate the dictionary used in the app.

## KanaDictionary

Steps:

1. Run "yarn spider spider/KanaDictionaryGenerator.js"

   1. Read KanaDictionaryCSV.csv
   2. Write to KanaDictionaryJson.json

## BiaozhunRibenyu

Steps:

1. Edit BiaozhunRibenyuInput.csv
1. Run "Furigana.bas"
1. Run "yarn spider spider/BiaozhunRibenyuGenerator.js"

   1. Read BiaozhunRibenyuInput.csv
   2. Write to BiaozhunRibenyuValidate.csv
   3. Write to BiaozhunRibenyuOutput.csv

1. Manual Validate BiaozhunRibenyuValidate.csv
1. Manual Validate BiaozhunRibenyuOutput.json

## Manual tag

excel => trigger excel splitter and parser
manual => manual furigana but auto validate
special => no validate
gairaigo => look up gairaigo, no validate
(empty) => trigger kuroshiro parser and validate
