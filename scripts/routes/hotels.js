/*global define*/

define([
    'jquery',
    'backbone',
    'layoutmanager',
    '../views/homepage',
    '../views/compare',
    '../views/hotel-page',
], function ($, Backbone, LM, HomepageView, CompareView, HotelPage) {
    'use strict';

    var HotelsRouter = Backbone.Router.extend({
        routes: {
            '': 'pageIndex',
            'index': 'pageIndex',
            'hotel/:id': 'pageHotel',
            'compare': 'pageCompare'
        },
        _setPage: function (page, forcedClassName) {
            if (this.page) {
                this.page.remove();
            }
            this.page = page;
            App.layout.insertView('.main-container', page);
            page.render();

            App.layout.$el.attr('class', forcedClassName);
        },
        pageIndex: function () {
            this._setPage( new HomepageView({
                model: App.Search
            }), "main" );
        },
        pageCompare: function () {
            if (!App.Search.get('destinationName')) {
                App.router.navigate('',{trigger: true, replace: true});
                return;
            }

            this._setPage( new CompareView({
                model: App.Search
            }), "compare" );
        },
        pageHotel: function (id) {
            var model = App.Search.results.get(id);
            if (!model) {
                App.router.navigate('',{trigger: true, replace: true});
                return;
            }

            this._setPage( new HotelPage({
                model: model
            }), "single hotel");
        }
    });

    return HotelsRouter;
});
