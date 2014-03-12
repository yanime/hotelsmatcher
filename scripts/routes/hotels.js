/*global define*/

define([
    'jquery',
    'backbone',
    'layoutmanager',
    '../views/homepage',
    '../views/compare'
], function ($, Backbone, LM, HomepageView, CompareView) {
    'use strict';

    var HotelsRouter = Backbone.Router.extend({
        routes: {
            '': 'pageIndex',
            'index': 'pageIndex',
            'hotel/:id': 'pageHotel',
            'compare': 'pageCompare'
        },
        _setPage: function (page) {
            if (this.page) {
                this.page.remove();
            }
            this.page = page;
            App.layout.insertView('.main-container', page);
            page.render();
        },
        pageIndex: function () {
            this._setPage( new HomepageView({
                model: App.Search
            }) );
            App.layout.$el.attr('class', 'home');
        },
        pageCompare: function () {
            if (!App.Search.get('destination-name')) {
                App.router.navigate('',{trigger: true, replace: true});
                return;
            }

            App.Search.fetch();

            this._setPage( new CompareView({
                model: App.Search
            }) );

            App.layout.$el.attr('class', 'compare');
        },
        pageHotel: function (id) {
        }
    });

    return HotelsRouter;
});
