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
            this.countPerPage = options.maxCountPerPage;
            this.countPinned = options.pinnedCount;
            this.calculateNumberOfPages();
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
        calculateNumberOfPages: function () {
            this.numberOfPages = Math.ceil ( ( this.model.length - this.countPinned ) / this.countPerPage );
        },
        serialize: function () {
            return this.numberOfPages;
        },
        afterRender: function () {
            this._cachedCurrentPage = this._getPageBtnEl(0);
        },
        _getPageBtnEl: function (page) {
            // works ok because nex/prev btns are after the pages ones
            return this.el.getElementsByTagName('button')[page];
        },
        _handlePinnedAction: function () {
        },
        _handlePaginationNavigation: function (e) {
            var newPage = Number(e.currentTarget.innerHTML) - 1;
            if (this.page === newPage) {
                return;
            }
            this._cachedCurrentPage.className = '';
            this._cachedCurrentPage = e.currentTarget;
            this._cachedCurrentPage.className = 'active';
            this.page = newPage;
            this.trigger('change', newPage);
        },
        _handlePaginationPrevious: function (e) {
            if (this.page > 0) {
                this.page--;
                this.trigger('change', this.page);
                this.syncDisplay(this.page);
            }
        },
        _handlePaginationNext: function (e) {
            if (this.page < this.numberOfPages) {
                this.page++
                this.trigger('change', this.page);
                this.syncDisplay(this.page);
            }
        }
    });

    return PaginationView;
});
