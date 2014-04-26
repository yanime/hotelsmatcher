/*global define*/

define([
    'underscore',
    'backbone',
    'models/result'
], function (_, Backbone, ResultModel) {
    'use strict';

    var ResultsCollection = Backbone.Collection.extend({
        model: ResultModel,
        add: function (data) {
            var result = _.pick(data,
                'tripAdvisorRating',
                'deepLink',
                'proximityDistance',
                'hotelRating',
                'name',
                'highRate');
            Backbone.Collection.prototype.add.call(this, result);
        }
    });

    return ResultsCollection;
});
