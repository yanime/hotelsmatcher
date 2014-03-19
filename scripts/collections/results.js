/*global define*/

define([
    'underscore',
    'backbone',
    'models/result'
], function (_, Backbone, ResultsModel) {
    'use strict';

    var ResultsCollection = Backbone.Collection.extend({
        model: ResultsModel,
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
