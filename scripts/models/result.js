/*global define*/
define([
    'underscore',
    'backbone',
    'layoutmanager',
], function (_, Backbone, Layout) {
    'use strict';

    var ResultModel = Backbone.Model.extend({
        manage: true,
        template: 'results',
        initialize: function () {
            this.pinned = false;
        }
    });

    return ResultModel;
});
