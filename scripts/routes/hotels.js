/*global define*/

define([
    'jquery',
    'backbone',
    '../views/autocomplete'
], function ($, Backbone, AutocompleteView) {
    'use strict';

    var HotelsRouter = Backbone.Router.extend({
        routes: {
            '': 'pageIndex',
            'index': 'pageIndex',
            'hotel/:id': 'pageHotel',
            'compare': 'pageCompare'
        },
        pageIndex: function () {
            new AutocompleteView({
                el: $('#search-wrapper')
            });
        },
        pageCompare: function () {
        },
        pageHotel: function (id) {
        }
    });

    return HotelsRouter;
});
