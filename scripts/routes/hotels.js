/*global define*/

define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    'use strict';

    var HotelsRouter = Backbone.Router.extend({
        routes: {
            '': 'pageIndex',
            'hotel/:id': 'pageHotel',
            'compare': 'pageCompare'
        },
        pageIndex: function () {
        },
        pageCompare: function () {
        },
        pageHotel: function (id) {
        }
    });

    return HotelsRouter;
});
