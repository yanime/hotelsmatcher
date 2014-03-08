/*global define*/

define([
    'jquery',
    'backbone',
    'layoutmanager',
    '../views/homepage'
], function ($, Backbone, LM, HomepageView) {
    'use strict';

    var HotelsRouter = Backbone.Router.extend({
        routes: {
            '': 'pageIndex',
            'index': 'pageIndex',
            'hotel/:id': 'pageHotel',
            'compare': 'pageCompare'
        },
        _setPage: function (page) {
            App.layout.insertView('.main-container', page);
            page.render();
        },
        pageIndex: function () {
            var page = new HomepageView();
            this._setPage(page);
        },
        pageCompare: function () {
        },
        pageHotel: function (id) {
        }
    });

    return HotelsRouter;
});
