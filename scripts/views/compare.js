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
            this.notPinnedView = new ResultsView();
            this.notPinnedView.model = this.model.results;
        },
        serialize: function () {
            console.log(this.model.attributes);
            return this.model.attributes;
        },
        beforeRender: function () {
            //this.notPinnedView.render();
            this.insertView('#results', this.notPinnedView);
        },
    });

    return CompareView;
});
