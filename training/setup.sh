#!/bin/bash

CLASSIFIER_USERNAME="<username>"
CLASSIFIER_PASSWORD="<password>"
CLASSIFIER_URL="https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"

DIALOG_USERNAME="<username>"
DIALOG_PASSWORD="<password>"
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
