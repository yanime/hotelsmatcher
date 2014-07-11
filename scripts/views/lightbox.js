/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
], function ($, _, Backbone, Layout) {
    'use strict';

    var LightboxView = Backbone.View.extend({
        manage: true,
        template: 'lightbox',
        className: "book details floating hidden",
        events: {
        },
        handle: function (model) {
            this.model = model;
        },
        displayAt: function (leftPX) {
            this.render();
            this.$el.removeClass('hidden');
            this.$el.css({
                left: leftPX
            });
        }
    });

    return LightboxView;
});
