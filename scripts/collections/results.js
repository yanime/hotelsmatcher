/*global define*/

define([
    'underscore',
    'backbone',
    'models/result'
], function (_, Backbone, ResultModel) {
    'use strict';

    var ResultsCollection = Backbone.Collection.extend({
        model: ResultModel,
        addSearchResult: function (data) {
            var result = _.pick(data,
                'hotelId',
                'tripAdvisorRating',
                'proximityDistance',
                'hotelRating',
                'name',
                'highRate',
				'search_options'
			);

            result.id = data.hotelId;

            this.add(result, {merge: true});
        }
    });

    return ResultsCollection;
});
