/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'views/result'
], function ($, _, Backbone, Layout, ResultView) {
    'use strict';

    var ResultsView = Backbone.View.extend({
        manage: true,
        className: 'compare-table',
        template: 'results',
        initialize: function (options) {
            this.page = options.page;
            this.countPerPage = options.countPerPage;
        },
        serialize: function () {
            return {
                page: this.page,
                numberOfPages: this.model.length / this.countPerPage
            }
        },
        beforeRender: function () {
            var pos = this.page * this.countPerPage;
            var end = pos + this.countPerPage;
            var item;
            var view;

            for ( pos; pos < end; pos++ ){
                item = this.model.at(pos);

                if (item) {
                    this.insertView(view = new ResultView({
                        model: item
                    }));
                    this.listenTo(view, 'result:pin', this._handlePinClicked);
                    this.listenTo(view, 'result:unpin', this._handlePinClicked);
                }
            }
        },
        afterRender: function () {
        },
        _handlePinClicked: function () {
            debugger;
        }
    });

    return ResultsView;
});
