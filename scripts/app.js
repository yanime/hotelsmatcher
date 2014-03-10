/*global define */
define(['layoutmanager', 'routes/hotels', 'templates'], function (LayoutManager, Router, JST) {
    'use strict';
    Backbone.Layout.configure({
        prefix: "app/scripts/templates/",
        fetchTemplate: function(path) {
            path += '.ejs';
            return JST[path];
        }
    });
    var app = {
        layout: ( new Backbone.Layout({
            template: 'main',
        })),
        start: function () {
            App.layout.render();
            App.layout.$el.appendTo(".app-content");
            App.router = new Router();
            Backbone.history.start();
        }
    }
    window.App = app;
    return app;
});
