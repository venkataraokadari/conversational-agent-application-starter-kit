/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express  = require('express'),
  app        = express(),
  extend     = require('util')._extend,
  pkg        = require('./package.json'),
  fs         = require('fs'),
  Q          = require('q');


// Bootstrap application settings
require('./config/express')(app);

var PROMPT_MOVIE_SELECTED = 'USER CLICKS BOX';
var PROMPT_MOVIES_RETURNED = 'UPDATE NUM_MOVIES';
var PROMPT_CURRENT_INDEX = 'UPDATE CURRENT_INDEX';

var apis = require('./api/services');

var converse = Q.nfbind(apis.dialog.conversation.bind(apis.dialog));
var updateProfile = Q.nfbind(apis.dialog.updateProfile.bind(apis.dialog));
var getIntent = Q.nfbind(apis.classifier.classify.bind(apis.classifier));
var searchMovies = Q.nfbind(apis.movieDB.searchMovies.bind(apis.movieDB));
var getMovieInformation = Q.nfbind(apis.movieDB.getMovieInformation.bind(apis.movieDB));

var errorWithClassifierService = function (error){
  console.log('Error using the Natural Language Classifier service');
  console.log(error.description || error);
};

// create the conversation
app.post('/api/create_conversation', function(req, res, next) {
  converse(req.body)
  .then(function(result){
    res.json(result[0]);
  })
  .catch(next);
});

// converse
app.post('/api/conversation', function(req, res, next) {
  getIntent({ text: req.body.input })
  .then(function(result) {
    var classes = result[0].classes;
    var profile = {
      client_id: req.body.client_id,
      name_values: [
        { name:'Class1', value: classes[0].class_name },
        { name:'Class1_Confidence', value: classes[0].confidence },
        { name:'Class2', value: classes[1].class_name },
        { name:'Class2_Confidence', value: classes[1].confidence }
      ]
    };
    return updateProfile(profile);
  })
  .catch(errorWithClassifierService)
  .then(function() {
    return converse(req.body)
    .then(function(result) {
      var conversation = result[0];
      if (searchNow(conversation.response.join(' '))) {
        var searchParameters = parseSearchParameters(conversation);
        conversation.response = conversation.response.slice(0, 1);
        return searchMovies(searchParameters)
        .then(function(searchResult) {
          console.log('searchMovies', JSON.stringify(searchResult, null, 2));
          var profile = {
            client_id: req.body.client_id,
            name_values: [
              { name:'Current_Index', value: searchResult.curent_index },
              { name:'Total_Pages', value: searchResult.total_pages },
              { name:'Num_Movies', value: searchResult.total_movies }
            ]
          };
          return updateProfile(profile)
          .catch(errorWithClassifierService)
          .finally(function() {
            var params = extend({}, req.body);
            if (['new','repeat'].indexOf(searchParameters.page) !== -1)
              params.input = PROMPT_MOVIES_RETURNED;
            else
              params.input = PROMPT_CURRENT_INDEX;

            return converse(params)
            .then(function(result) {
              res.json(extend(result[0], searchResult));
            });
          });
        });
      } else {
        res.json(conversation);
      }
    });
  })
  .catch(next);
});

function searchNow(message) {
  return message.toLowerCase().indexOf('search_now') !== -1;
}

function parseSearchParameters(conversation) {
  var params = conversation.response[1].toLowerCase().slice(1, -1);
  params = params.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
  return JSON.parse(params);
}

app.get('/api/movies', function(req, res, next) {
  getMovieInformation(req.query)
  .then(function(movie){
    console.log('getMovieInformation', JSON.stringify(movie,null,2));
    var profile = {
      client_id: req.body.client_id,
      name_values: [
        { name:'Selected_Movie', value: movie.movieName },
        { name:'Popularity_Score', value: movie.popularity }
      ]
    };
    return updateProfile(profile)
    .then(function() {
      var params = {
        client_id: req.query.client_id,
        conversation_id: req.query.conversation_id,
        input: PROMPT_MOVIE_SELECTED
      };
      return converse(params)
      .then(function(result) {
        res.json(extend(result[0], { movies: [movie]}));
      });
    });
  })
  .catch(next);
});


/**
 * Returns the classifier_id and dialog_id to the user.
 */
app.get('/api/services', function(req, res) {
  var services = {};

  fs.readFile('training/dialog_id', 'utf8', function(error, data){
    if (!error)
      services.dialog_id = data;

    fs.readFile('training/classifier_id', 'utf8', function(error, data){
      if (!error)
        services.classifier_id = data;

      res.json(services);
    });
  });
});

// error-handler application settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
var host = process.env.VCAP_APP_HOST || 'localhost';
app.listen(port);

console.log(pkg.name+ ':'+ pkg.version, host+':'+port);
