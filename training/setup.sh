#!/bin/bash

CLASSIFIER_USERNAME="fd269678-5503-4d25-bb6c-9fbecb3eb438"
CLASSIFIER_PASSWORD="6Hdv2YzZAvBS"
CLASSIFIER_URL="https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"

DIALOG_USERNAME="d23fbbd8-9362-4d79-9f10-b22fe00f2b59"
DIALOG_PASSWORD="fAjJ8skgb5YD"
DIALOG_URL="https://gateway.watsonplatform.net/dialog/api/v1/dialogs"


echo "Creating a dialog"
curl -u "$DIALOG_USERNAME:$DIALOG_PASSWORD" \
-F file=@dialog_and_classifier.xml \
-F "name=movies-and-classifier" \
"$CLASSIFIER_URL"


echo "Training a classifier"
curl -u "$CLASSIFIER_USERNAME:$CLASSIFIER_PASSWORD" \
-F training_data=@classifier_training.csv \
-F training_metadata="{\"language\":\"en\",\"name\":\"movie-intent\"}" \
"$DIALOG_URL"
