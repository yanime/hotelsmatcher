/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'views/hotel-images'
], function ($, _, Backbone, Layout, HotelImages) {
    'use strict';

    var ResultView = Backbone.View.extend({
        manage: true,
        template: 'result',
        events: {
            'click .pin': '_handleResultPinned'
        },
        className: function () {
            if (this.model.pinned) {
                return 'hotel info column fixed pinned';
            }
            return 'hotel info column fixed unpinned';
        },
        initialize: function () {
            this.listenTo(this.model, 'result:update', this.handleModelLoaded);

            this._imagesView = new HotelImages({
                useThumbnails: true
            });
        },
        beforeRender: function () {
            this.insertView('.photos', this._imagesView);
        },
        handleModelLoaded: function () {
            console.log(this.model.attributes);
            this._imagesView.model = this.model.attributes.images;
            this._imagesView.render();
        },
        serialize: function () {
            return this.model.attributes;
        },
        _handleResultPinned: function () {
            if (this.model.pinned) {
                this.trigger('result:unpin', this);
            } else {
                this.trigger('result:pin', this);
            }
        }
    });

    return ResultView;
});
