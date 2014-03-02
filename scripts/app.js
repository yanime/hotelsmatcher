/*global define */
define(['backbone','routes/hotels'], function (Backbone, Router) {
    'use strict';
    var app = {
        start: function () {
            new Router();
            Backbone.history.start();
        }
    }
    return app;
});
