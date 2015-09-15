/*global define*/

define([
    'underscore',
    'backbone',
    'models/result'
], function (_, Backbone, ResultModel) {
    'use strict';

    var ResultsCollection = Backbone.Collection.extend({
        model: ResultModel,
        sortType: 'highRate',
        addSearchResult: function (data) {
            var result = _.pick(data,
                'hotelId',
                'tripAdvisorRating',
                'proximityDistance',
                'hotelRating',
                'name',
                'highRate',
				'search_options',
                'facilities'
			);

            result.id = data.hotelId;

            this.add(result, {merge: true});
        },
        comparator: function(item) {
            return item.attributes[this.sortType]
        },
        sortModels: function(sortType){
            this.sortType = sortType;
            this.sort();
        }
    });

    return ResultsCollection;
});
