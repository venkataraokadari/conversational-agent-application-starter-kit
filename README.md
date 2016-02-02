# Movie Assistant

  This is an small version of [What's in Theaters](https://github.com/watson-developer-cloud/movieapp-dialog) created to highlight how to combine [Dialog][dialog] and [Natural Language Classifier][classifier] services to create a [Conversational Agent]() pattern.


Give it a try! Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/germanattanasio/movie-assistant)

**Note:** The application will mock data when suggesting movies until you provide an API Key to [themoviedb.com]()

## Conversational Agent Pattern

Describe how to combine both services and show some examples from this project.

## Getting started
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
  dialog_id: "24045716-d5cc-4748-afed-a4ea0287b737",
  classifier_id: "563C46x19-nlc-3140"
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
