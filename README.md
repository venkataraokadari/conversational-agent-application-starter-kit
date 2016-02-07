# Movie Assistant

This application is an [Application Starter Kit](#application-starter-kit) that is designed to quickly get you up and running with a common industry pattern, and can serve as the basis for your own applications that follow that pattern. This app was created to highlight the combination of the [Dialog][dialog] and [Natural Language Classifier][classifier] (NLC) services as a [Conversational Agent](#conversational-agent). Another application that demonstrates this pattern is the [What's in Theaters](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/gallery.html#whats-in-theaters) application that is available in the Watson Developer Cloud website's [Application Gallery](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/gallery.html).

Give it a try! Click the button below to fork the repository that contains the source code for this application into IBM DevOps Services, and to deploy your own copy of this application on Bluemix:

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/germanattanasio/movie-assistant)

**IMPORTANT:**
  1. The application uses mock data for movie suggestions until the user provides an API Key for [themoviedb.com](https://www.themoviedb.org/documentation/api), which you can not do when using the **Deploy to Bluemix** button. See [step 8](#step8) in the [Getting Started](#getting-started) section.
  2. When the application is first run, it will automatically train a classifier for NLC. This process takes about 20 minutes. While the classifier is being trained, the user can only interact with the Dialog service.

## Table of Contents
  - [How this app works](#how-this-app-works)
  - [Getting Started](#getting-started)
  - [Running the application locally](#running-the-application-locally)
  - [Application Starter Kit](#application-starter-kit)
  - [Conversational Agent](#conversational-agent)
    - [When to use this pattern](#when-to-use-this-pattern)
    - [Best practices](#best-practices)
    - [Reference information](#reference-information)
        - [Dialog](#dialog)
        - [Natural Language Classifier](#natural-language-classifier)
  - [Troubleshooting](#troubleshooting)

### How this app works

This app provides a conversational interface that lets users search for movies based on a set of criteria. The dialog system is built to understand natural language related to searching and selecting movies. For example, "I'd like to see a recent R rated drama" returns the names of all R-rated dramas that have been released in the last 30 days.

This application's dialog system also understands variations of text, which allows users to phrase their responses in many different ways. For example, the system might ask, "Do you want to watch an upcoming movie or one that's playing tonight?" The user can reply with "tonight" or "Show me movies playing currently," and the system understands that the user wants to know about current movies.

The conversation is designed to obtain three pieces of information before searching the movie repository:

* Recency: The system determines whether users want to know about currently playing movies or upcoming movies
* Genre: The system understands movie genres, such as action, comedy, and horror
* Rating: The system understands movie ratings, such as G, PG-13, and R

Users can search across all genres and ratings by answering "no" to the corresponding questions.

## Getting Started
The application is written in [Node.js](http://nodejs.org/) and uses [npm](https://www.npmjs.com/).  Instructions for downloading and installing these are included in the following procedure.

If you've [forked the project](https://github.com/germanattanasio/movie-assistant#fork-destination-box) and want to push that fork to Bluemix, do the following steps. If you want to run the application locally, see the next section, [Running the application locally](#running-the-application-locally):

  1. Clone your fork of the project repository to your local system.

  2. Create a Bluemix account. [Sign up][sign_up] in Bluemix or use an existing account. Watson services in beta are free to use, as are GA services in the standard plan below a certain usage threshold.

3. Download and install the [Cloud-foundry CLI][cloud_foundry] tool.

  4. Edit the `manifest.yml` file in your fork and replace `<application-name>` with a unique name for your copy of the application. The name that you specify determines the application's URL, such as `<application-name>.mybluemix.net`.

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

  5. Connect to Bluemix by running the following commands in a terminal window:

    ```sh
    $ cf api https://api.ng.bluemix.net
    $ cf login -u <your-Bluemix-ID>
    ```

  6. Create an instance of the Dialog service in Bluemix by running the following command:

    ```sh
    $ cf create-service dialog standard dialog-service
    ```

  7. Create the Natural Language Classifier service:

    ```sh
    $ cf create-service natural_language_classifier standard classifier-service
    ```

  <a name="step8"></a>
  8. Sign up at [themoviedb.com][the_movie_db] and get an [API key][the_movie_db_api_key]. Add the API key to the app by editing the line 29 of the file `api/services.js` to read:

    ```js
    var TMDB_API_KEY = process.env.TMDB_API_KEY || <Your API Key>;
  	```
  9. Push the updated application live by running the following command:

    ```sh
    $ cf push
    ```

The first time it runs, the application creates:

  * A dialog flow using: `training/dialog_and_classifier.xml` and writes the dialog id to the file `/training/dialog_id`
  * A classifier using: `training/classifier_training.csv` and writes classifier id to the file `/training/classifier_id`

You can retrieve these ids at `<application-name>.mybluemix.net/api/services`, where `<application-name>` is the name that you gave your application in step 4 of the previous list. The response will be similar to:

```json
{
  "dialog_id": "24045716-d5cc-4748-afed-a4ea0287b737",
  "classifier_id": "563C46x19-nlc-3140"
}
```

## Running the application locally
  The application is written in [Node.js](http://nodejs.org/) and uses [npm](https://www.npmjs.com/).  Instructions for downloading and installing these are included in the following procedure:

  1. Clone the [Movie Assistant repository](https://github.com/germanattanasio/movie-assistant) into a local folder, and go to that folder.

  2. If you did not work through the steps in the [Getting Started](#getting-started) section, follow steps 2 through 8 in that section, editing the `manifest.yml` file in your local clone of the repository instead of in a fork of the repository.

  3. Create a `.env.js` file in the root directory of the project with the following content:

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

  4. Copy the `username`, `password`, and `url` credentials from your `dialog-service` and `classifier-service` services in Bluemix to the previous file. To see the service credentials for each of your service instances, run the following command, replacing `<application-name>` with the name of the application that you specified in your `manifest.yml` file:

    ```sh
    $ cf env <application-name>
    ```
   Your output should look similar to:

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

  5. If it is not already installed on your system, install [Node.js](http://nodejs.org/). Installing Node.js will also install the `npm` command.


  6. Install any dependencies that the application requires:

    ```sh
    $ npm install
    ```

  7. Start the application by running:

    ```sh
    $ gulp
    ```
  8. Open [http://localhost:5000](http://localhost:5000) to see the running application.


## Application Starter Kit
An Application Starter Kit (ASK) is a multi-service sample application that is designed to demonstrate common industry `patterns` and best practices around Watson services.

This sample application highlights one of those industry patterns, known as a [Conversational Agent](#conversational-agent).

## Conversational Agent

First, make sure you read the [Reference Information](#reference-information) to understand the services that are involved in this pattern. This reference information will explain common terminology for these services such as `classifier`, `confidence scores`, `intents`, `training`, and so on.

The following image shows a flow diagram for a Conversational Agent using the Natural Language Classifier and the Dialog service:
<p align="center">
  <img src="docs/demo_architecture.png"/>
</p>

### Using the Dialog service and the Natural Language Classifier service

Since the Dialog service uses expert rules to match user inputs to intents, the service typically has high accuracy. The Natural Language Classifier service is a statistical system that yields high recall.  The combination of the Dialog and Natural Language Classifier services therefore creates a high precision, high accuracy system.

For a given input, a trained Natural Language Classifier responds with a list of intent classes and the corresponding confidence scores. Dialog only uses the top two classes to decide how to proceed with the conversation. The following checks are performed by the Dialog service:

 * The USER_INTENT from the Classifier service is considered valid when class(0).confidence >= upper_confidence_threshold.
 * Ask user to confirm the USER_INTENT when upper_confidence_threshold >= class(0).confidence > lower_confidence_threshold.
 * Ask user to disambiguate between USER_INTENT(0) and USER_INTENT(1) when class(0).confidence + class(1).confidence > upper_confidence_threshold.
 * Reply with the default response when none of the previous checks are true.

In this case, class(0) is the top class and class(0).confidence is its confidence score. Similarly, class(1) is the second best class with class(1).confidence being its confidence score. In these checks, upper_confidence_threshold and lower_confidence_threshold are floats 0 - 1, and their values are obtained by running cross-validation tests with the classifier on a given data set.

---

When creating an application based on the conversational pattern, you should first understand what the user is trying to do. Is he looking up an actor? Is she searching for upcoming movies? Is she simply looking to have small talk with Watson? We call these the user's *Intent*. To extract the user intent from the user input, we train the Watson Natural Language Classifier using various examples of possible user requests. The service then uses deep machine learning techniques to return the top predicted classes.

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

Next, we need to acquire any additional information that is required to complete the user's request. To do this, we rely on the Dialog service. The Dialog service tracks and stores information obtained during the conversation until we have all the information required to complete the task.  In the case of this application, it's searching for a movie, an actor, or a director.

### When to use this pattern
 * You need to perform a task that requires user input and you want to mimic a conversation
 * You want to provide a conversation experience like Siri or Cortana

### Some best practices
 * When using the Natural Language Classifier, there should be approximately 10 classes.  Each class should have 15 examples of possible user inputs. This provides the service with enough information to build the deep machine learning model that will classify future user inputs.
 * When using the Dialog service, define different opening sentences in the dialog flow (.xml file). This will prevent repetitive conversations where the dialog always asks the same questions.

### Reference information
The following links provide more information about the Dialog and Natural Language Classifier services, including tutorials on using those services:

##### Dialog

* [API documentation](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/dialog/): Get an in-depth knowledge of the Dialog service
* [API reference](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/dialog/api/v1/): SDK code examples and reference
* [API explorer](https://watson-api-explorer.mybluemix.net/apis/dialog-v1): Try out the REST API
* [Creating your own dialog](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/dialog/tutorial_advanced.shtml): Design your own dialog by working through a tutorial
* [Natural conversation tutorial](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/ega_docs/dialog_ega.shtml#naturalconvo_design): Advance tutorial on how to create a conversion like the one in this sample application

##### Natural Language Classifier

* [API documentation](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/nl-classifier/): Get an in-depth knowledge of the Natural Language Classifier service
* [API reference](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/natural-language-classifier/api/v1/): SDK code examples and reference
* [API Explorer](https://watson-api-explorer.mybluemix.net/apis/natural-language-classifier-v1): Try out the API
* [Creating your own classifier](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/nl-classifier/get_start.shtml): How to use the API to create and use your own classifier
* [Understanding how Dialog uses the output from the Natural Language Classifier](http://heidloff.net/article/cognitive-question-answer-systems-bluemix-watson)

## Troubleshooting

When troubleshooting your Bluemix app, the most useful source of information is the execution logs. To see them, run:

  ```sh
  $ cf logs <application-name> --recent
  ```

## Open Source @ IBM
  Find more open source projects on the [IBM GitHub Page](http://ibm.github.io/)

### License

  This sample code is licensed under the Apache 2.0 license. Full license text is available in [LICENSE](LICENSE).

### Contributing

  See [CONTRIBUTING](CONTRIBUTING.md).


[cloud_foundry]: https://github.com/cloudfoundry/cli
[sign_up]:https://console.ng.bluemix.net/registration/
[dialog]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/dialog.html
[classifier]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/nl-classifier.html
[the_movie_db]: https://www.themoviedb.org/account/signup
[the_movie_db_api_key]: https://www.themoviedb.org/documentation/api
