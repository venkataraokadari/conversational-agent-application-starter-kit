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

var watson  = require('watson-developer-cloud');
var fs = require('fs');

var DIALOG_ID = fs.readFileSync('keys/dialog_id', 'utf8');
var CLASSIFIER_ID = fs.readFileSync('keys/classifier_id', 'utf8');
var TMDB_API_KEY = process.env.TMDB_API_KEY || 'TMDB_API_KEY';

module.exports = {
  dialog : watson.dialog({
    username: '<username>',
    password: '<password>',
    version: 'v1',
    path: { dialog_id: DIALOG_ID }
  }),

  movieDB: require('./moviedb')(TMDB_API_KEY),

  classifier: watson.natural_language_classifier({
    username: '<username>',
    password: '<password>',
    version: 'v1',
    path: { classifier_id: CLASSIFIER_ID }
  })
};
