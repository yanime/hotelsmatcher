/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'views/results',
    'views/pagination'
], function ($, _, Backbone, Layout, ResultsView, PaginationView) {
    'use strict';

    var CompareView = Backbone.View.extend({
        manage: true,
        tagName: 'main',
        className: 'main wrapper clearfix',
        template: 'compare',
        page: 0,
        maxCountPerPage: 6,
        initialize: function () {
            this.resultsView = new ResultsView({
                model: this.model.results,
                countPerPage: this.maxCountPerPage
            });
            this.topPagination = new PaginationView({
                model: this.model.results,
                maxCountPerPage: this.maxCountPerPage,
                pinnedCount: this.resultsView.pinnedCount
            });
            this.bottomPagination = new PaginationView({
                model: this.model.results,
                maxCountPerPage: this.maxCountPerPage,
                pinnedCount: this.resultsView.pinnedCount
            });

            this.resultsView.connectPaginationView(this.topPagination);
            this.resultsView.connectPaginationView(this.bottomPagination);

            this.bottomPagination.listenTo(this.topPagination, 'change', this.bottomPagination.syncDisplay);
            this.topPagination.listenTo(this.bottomPagination, 'change', this.topPagination.syncDisplay);
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
            this.insertView('.pagination.top', this.topPagination);
            this.insertView('.pagination.bottom', this.bottomPagination);
        },
    });

    return CompareView;
});
