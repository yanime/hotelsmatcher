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
            console.log('called');
            this.resultsView = new ResultsView({
                model: this.model.results,
                page: 0,
                countPerPage: 6
            });
        },
        events: {
            'click .button.edit': "_handleChangeSearch"
        },
        _handleChangeSearch: function () {
            App.router.navigate('index',{trigger: true});
        },
        serialize: function () {
            return this.model.attributes;
        },
        beforeRender: function () {
            this.insertView('#results', this.resultsView);
        },
    });

    return CompareView;
});
