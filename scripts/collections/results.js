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
                'deepLink',
                'proximityDistance',
                'hotelRating',
                'name',
                'highRate');
            this.add.call(this, result);
        }
    });

    return ResultsCollection;
});
