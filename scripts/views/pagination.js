/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'views/results'
], function ($, _, Backbone, Layout, ResultsView) {
    'use strict';


    var PaginationView = Backbone.View.extend({
        manage: true,
        tagName: 'div',
        template: 'pagination',
        page: 0,
        numberOfPages: 1,
        _cachedCurrentPage: null,
        initialize: function (options) {
            this.counts = options.counts;
        },
        events: {
            'click .step.left': '_handlePaginationPrevious',
            'click .step.right': '_handlePaginationNext',
            'click li button': '_handlePaginationNavigation'
        },
        syncDisplay: function (page) {
            this.page = page;
            this._cachedCurrentPage.className = '';
            this._cachedCurrentPage = this._getPageBtnEl(page);
            this._cachedCurrentPage.className = 'active';
            // @todo sync paginations
        },
        serialize: function () {
            return this.counts.countPages;
        },
        afterRender: function () {
            this._cachedCurrentPage = this._getPageBtnEl(0);
        },
        _getPageBtnEl: function (page) {
            // works ok because nex/prev btns are after the pages ones
            return this.el.getElementsByTagName('button')[page];
        },
        _handlePinnedAction: function () {
            this.render();
        },
        _handlePaginationNavigation: function (e) {
            var newPage = Number(e.currentTarget.innerHTML) - 1;

            if (this.counts.page === newPage) {
                return;
            }

            this.counts.page = newPage;

            this.trigger('change', this.counts.page);
            this.syncDisplay(newPage);
        },
        _handlePaginationPrevious: function (e) {
            if (this.counts.page > 0) {
                this.counts.page--;
                this.trigger('change', this.counts.page);
                this.syncDisplay(this.counts.page);
            }
        },
        _handlePaginationNext: function (e) {
            if (this.counts.page < this.counts.countPages - 1) {
                this.counts.page++;
                this.trigger('change', this.counts.page);
                this.syncDisplay(this.counts.page);
            }
        }
    });

    return PaginationView;
});
