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
            this._pinnedCount = 0;
        },
        serialize: function () {
            return {
                page: this.page,
                numberOfPages: this.model.length / this.countPerPage
            };
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
                    this.listenTo(view, 'result:pin', this._handlePin);
                    this.listenTo(view, 'result:unpin', this._handleUnpin);
                }
            }
        },
        afterRender: function () {
            this._cachedDOMPinned = this.$el.find('.pinned-container');
        },
        _handlePin: function (view) {
            var element = view.$el;
            element.addClass('pinned');
            element.remove();
            this._cachedDOMPinned.append(element);

            view.delegateEvents();

            if (this._pinnedCount === 0) {
                this._cachedDOMPinned.removeClass('hidden');
            }
            this._pinnedCount++;
        },
        _handleUnpin: function (view) {
            var element = view.$el;
            element.remove();
            element.removeClass('pinned');
            this.$el.append(element);

            view.delegateEvents();

            this._pinnedCount--;
            if (this._pinnedCount === 0) {
                this._cachedDOMPinned.addClass('hidden');
            }
        }
    });

    return ResultsView;
});
