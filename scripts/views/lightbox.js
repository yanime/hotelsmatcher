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
            this.model.set({'pinned': true});
            this.model.pinned = true;
            this.render();
           // this.trigger('result:pin');
        },
        _handleUnpin: function () {
            this.model.set({'pinned': false});
            this.render();
           // this.trigger('result:pin');
        },
        _handleResultPinned: function () {
            if (this.model.get('pinned')) {
                this._handleUnpin();
            } else {
                this._handlePin();
            }
            console.log(this.model);
            this.model.trigger('result:pinUpdate');
        },
		close: function(){
			this.$el.addClass('hidden');
			this.$el.removeAttr('style');
		}
    });

    return LightboxView;
});
