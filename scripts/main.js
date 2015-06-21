/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        layoutmanager: {
            deps: [
                'backbone'
            ],
            exports: 'LayoutManager'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        moment: '../bower_components/momentjs/moment',
        layoutmanager: '../bower_components/layoutmanager/backbone.layoutmanager',
        underscore: '../bower_components/underscore/underscore'
    }
});

require(['dom-helpers', 'app'], function (domHelpers, App) {
    'use strict';
    $(document).ready(function(){
        App.start();
    });
});
