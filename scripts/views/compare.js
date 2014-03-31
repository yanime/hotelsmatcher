/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'views/results'
], function ($, _, Backbone, Layout, ResultsView) {
    'use strict';

    var CompareView = Backbone.View.extend({
        manage: true,
        tagName: 'main',
        className: 'main wrapper clearfix',
        template: 'compare',
        initialize: function () {
            this.notPinnedView = new ResultsView({
                model: this.model.results,
                start: 0,
                display: 6
            });
        },
        serialize: function () {
            return this.model.attributes;
        },
        beforeRender: function () {
            this.insertView('#results', this.notPinnedView);
        },
    });

    return CompareView;
});
