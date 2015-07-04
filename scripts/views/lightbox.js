/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager'
], function ($, _, Backbone, Layout) {
    'use strict';

    var LightboxView = Backbone.View.extend({
        manage: true,
        template: 'lightbox',
        className: "book details floating hidden",
        events: {
			'click .close': 'close',
            'click .pin': '_handleResultPinned'
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
        _handlePin: function () {
            this.render();
        },
        _handleUnpin: function () {
            this.render();
        },
        getState: function(){
            return this.model.get('pinned');
        },
        _handleResultPinned: function () {
            if (this.model.get('pinned')) {
                this._handleUnpin();
            } else {
                this._handlePin();
            }
            this.model.trigger('result:pinUpdate');
        },
		close: function(){
			this.$el.addClass('hidden');
			this.$el.removeAttr('style');
		}
    });

    return LightboxView;
});
