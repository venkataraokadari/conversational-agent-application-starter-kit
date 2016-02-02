# Movie Assistant

  This is an small version of [What's in Theaters](https://github.com/watson-developer-cloud/movieapp-dialog) created to highlight the combination of the [Dialog][dialog] and [Natural Language Classifier][classifier] services to create a [Conversational Agent](#pattern-conversational-agent).


Give it a try! Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix.  
[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/germanattanasio/movie-assistant)

**Notes:** The application will mock data when suggesting movies until you provide an API Key to [themoviedb.com](), see the step 7 In the Getting Started section. The application will automatically train a classifier which takes about 20 minutes so initially you will be only using the Dialog service.

## Table of Contents
 - [Getting started](#getting-started)
 - [Running the application locally](#running-the-application-locally)
 - [application-starter-kit](#application-starter-kit)
 - [Conversational Agent](#pattern-conversational-agent)
 - [Troubleshooting](#troubleshooting)

## Getting Started
If you fork the project and want to push your fork follow the next steps.

  1. Create a Bluemix account. [Sign up][sign_up] in Bluemix or use an existing account. Watson services in beta are free to use.

  2. Download and install the [Cloud-foundry CLI][cloud_foundry] tool.

  3. Edit the `manifest.yml` file and replace `<application-name>` with a unique name for your copy of the application. The name that you specify determines the application's URL, such as `<application-name>.mybluemix.net`.

    ```yml
    applications:
    - services:
      - dialog-service
      - classifier-service
      name: <application-name>
      command: npm start
      path: .
      memory: 256M
    ```

  4. Connect to Bluemix by running the following commands in the command-line tool:

    ```sh
    $ cf api https://api.ng.bluemix.net
    $ cf login -u <your-Bluemix-ID>
    ```

  5. Create the Dialog service in Bluemix by running the following command:

    ```sh
    $ cf create-service dialog standard dialog-service
    ```

  6. Create the Natural Language Classifier service:

    ```sh
    $ cf create-service natural_language_classifier standard classifier-service
    ```

  7. Sign up in [themoviedb.com](), get an API key and add it to the app by editing the `api/servies.js` file line 29.
    File `api/servies.js`:

    ```js
    var TMDB_API_KEY = process.env.TMDB_API_KEY || '';
  	```
  8. Push it live by running the following command:

    ```sh
    $ cf push
    ```

When running for the first time the application will create:

  * A dialog flow using: `training/dialog_and_classifier.xml` and write the id in `/training/dialog_id`
  * A classifier using: `training/classifier_training.csv` and write the id in `/training/classifier_id`

You can retrieve those ids at [`<application-name>.mybluemix.net/api/services`](). The response will be similar to:

```json
{
  "dialog_id": "24045716-d5cc-4748-afed-a4ea0287b737",
  "classifier_id": "563C46x19-nlc-3140"
}
```

## Running the application locally
  The application uses [Node.js](http://nodejs.org/) and [npm](https://www.npmjs.com/), so you must download and install them as part of the following steps.

  1. Create a `.env.js` file in the root directory of your project with the next content:

  ```js
  module.exports = {
  TMDB_API_KEY: 'TMDB API KEY HERE',
  VCAP_SERVICES: JSON.stringify({
    dialog: [{
      credentials: {
        url: 'https://gateway.watsonplatform.net/dialog/api',
        username: 'DIALOG USERNAME HERE',
        password: 'DIALOG PASSWORD HERE'
      }
    }],
    natural_language_classifier: [{
      credentials: {
        url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
        username: 'NATURAL LANGUAGE CLASSIFIER USERNAME HERE',
        password: 'NATURAL LANGUAGE CLASSIFIER PASSWORD HERE'
      }
    }]
  })
  };
  ```
  2. Copy the `username`, `password`, and `url` credentials from your `dialog-service` and `classifier-service` services in Bluemix to the previous file. To see the service credentials, run the following command, where `<application-name>` is the unique name you specified:

    ```sh
    $ cf env <application-name>
    ```
   You will get something like:

    ```sh
    System-Provided:
    {
    "VCAP_SERVICES": {
      "dialog": [{
        "credentials": {
          "url": "<url>",
          "password": "<password>",
          "username": "<username>"
        },
        "label": "dialog",
        "name": "dialog-service",
        "plan": "standard"
     }]
    }
    }
    ```

  2. Install [Node.js](http://nodejs.org/).
  3. Clone the repository into a local folder.
  3. Go to the project folder in a terminal and run:

    ```sh
    $ npm install
    ```

  4. Start the application by running:

    ```sh
    $ gulp
    ```
  5. Open [http://localhost:5000]() to see the running application.


## Application Starter Kit
An Application Starter Kit(ASK) is a multi-service Watson sample app built to show common industry 'patterns' and best practices around them.

This sample application highlights one of the industry patterns called [Conversational Agent](#pattern-conversational-agent).

## Conversational Agent


Make sure you read the [Reference Information](#reference-information) to understand the services involve in this pattern.

This image below shows a flow diagram for a Conversation Agent using the Natural Language Classifier and Dialog services.
<p align="center">
  <img src="docs/demo_architecture.png"/>
</p>

 A. Capture user input  
 B. Classify this input into one of existing intents like: search for a movie, lookup actors, small talk, etc.  
 C. Use the dialog flow to ask users for any additional information required to complete the task  
 D. Execute the task using the information collected during the conversation


When creating a conversational agent we first need to understand what the user is trying to do. Is he trying to lookup actors? search for upcoming movies? have an small talk with Watson?. We call that the user is trying to perform *Intent*.  To accomplish this, we'll train the Watson Natural Language Classifier service using various text examples of users making the requests. The servie uses deep machine learning techniques to return the top predicted classes.

Here is an example of what we will use to train the classifier:

    Who directed The Hobbit, LookupDirectors
    Who starred in The Hobbit, LookupActors
    Drama, SearchMovies
    I'd like to see a recent drama, SearchMovies
    Show me whats playing, SearchMovies
    Something sexy, SearchMovies
    Good day, ClosingTalk
    Hi, OpeningTalk
    Who is the producer of Vacation?,LookupDirectors
    Help,RepairTalk
    Robert,GiveName
    I want to look up movie stars,LookupActors

Next, we need any related information required to complete the user's request. To do this, we'll rely on the Dialog service which supports building conversations between a user and an application. The Dialog service will track and store information obtained during the conversation until we have all the info required to complete the task like search for a movie, arctor or director.

### When to use this pattern
 * You need to perform a task that requires user input and you want to mimic a conversation
 * You want to provide a conversation experience like Siri or Cortana.

### Best practices
 * Write around 10 classes/intent with 15 examples for each. That will provide to the Natural Language Classifier information to build the deep machine learning model that will be used to classify the user input.
 * Define different opening sentences in the dialog flow (.xml file). That will help you to avoid repetitive conversations where you dialog always ask the same questions.
 * **TODO:**

### Reference information
Here are some links with more inforamtion about the services and links to other Application Starter Kits.

##### Dialog

* [API documentation](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/dialog/): Get an in-depth knowledge of the Dialog service
* [API Explorer](https://watson-api-explorer.mybluemix.net/apis/dialog-v1): Try out the API
* [Creating your own dialog](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/dialog/tutorial_advanced.shtml): Design your own dialog by using a tutorial

##### Natural Language Classifier

* [API documentation](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/nl-classifier/): Get an in-depth knowledge of the Natural Language Classifier service
* [API Explorer](https://watson-api-explorer.mybluemix.net/apis/natural-language-classifier-v1): Try out the API.
* [Creating your own classifier](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/nl-classifier/get_start.shtml): How to use the API to create and use your own classifier

* [Understanding how Dialog uses the output from the Natural Language Classier](http://heidloff.net/article/cognitive-question-answer-systems-bluemix-watson)


## Troubleshooting

To troubleshoot your Bluemix app the main useful source of information are the logs, to see them, run:

  ```sh
  $ cf logs <application-name> --recent
  ```

## Open Source @ IBM
  Find more open source projects on the [IBM Github Page](http://ibm.github.io/)

### License

  This sample code is licensed under Apache 2.0. Full license text is available in [LICENSE](LICENSE).

### Contributing

  See [CONTRIBUTING](CONTRIBUTING.md).


[cloud_foundry]: https://github.com/cloudfoundry/cli
[sign_up]:https://console.ng.bluemix.net/registration/
[dialog]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/dialog.html
[classifier]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/nl-classifier.html
