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


module.exports = function() {
  console.log('WARNING: The TMDB_API_KEY was not specified '+
    'so you will be using a mock of the TMDB API responses');
  return {
    /**
     * Search for movies based on the parameters provided
     * by the user during the dialog
     */
    searchMovies: function(params, callback) {
      var results = {
        page: 1,
        total_pages: 1,
        total_movies: 3,
        curent_index: 3,
        movies: [{
          movie_id: 140607,
          movie_name: 'Star Wars: The Force Awakens'
        }, {
          movie_id: 365222,
          movie_name: 'Ip Man 3'
        }, {
          movie_id: 140300,
          movie_name: 'Kung Fu Panda 3'
        }]
      };
      return callback(null, results);
    },

    /**
     * Returns movie information based on the movie_id
     */
    getMovieInformation: function(params, callback) {
      var movie= {
        fake: true,
        movie_id: 140607,
        movie_name: 'Star Wars: The Force Awakens',
        runtime: 136,
        popularity: 8.5,
        poster_path: 'http://image.tmdb.org/t/p/w300//fYzpM9GmpBlIC893fNjoWCwE24H.jpg',
        trailer_url: 'https://www.youtube.com/embed/sGbxmsDFVnE?controls=0&amp;showinfo=0',
        certification: 'PG-13',
        release_date: '2015-12-14',
        overview: 'This is static information, check the README file in Github to '+
        'know how to use real data from themoviedb.com'
      };

      return callback(null, movie);
    }
  };
};
