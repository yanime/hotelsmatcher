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
			'click .close': 'close'
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
        },
		close: function(){
			this.$el.addClass('hidden');
			this.$el.removeAttr('style');
		}
    });

    return LightboxView;
});
