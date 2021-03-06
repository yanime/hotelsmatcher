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
        initialize: function () {
            this.listenTo(this.model, 'result:update', this._handleModelDetailsLoaded);
            this.listenTo(this.model, 'result:pinUpdate', this._handleResultPinned);
            this.listenTo(this.model, 'result:showAdditionalFacilities', this._showAdditionalFacilities);

            this._imagesView = new HotelImages({
                useThumbnails: true
            });
        },
        serialize: function () {
            return this.model.attributes;
        },
        beforeRender: function () {
            if (this.model.get('pinned')) {
                this.el.className = 'hotel info column fixed pinned';
            } else {
                this.el.className = 'hotel info column fixed unpinned';
            }
            this.insertView('.photos', this._imagesView);
        },
        refreshEvents: function () {
            this.delegateEvents();
            this._imagesView.delegateEvents();
        },
        _handleModelDetailsLoaded: function () {
            this._imagesView.model = this.model.attributes.images;
            this._imagesView.render();
            this.render();
        },
        _handleResultPinned: function () {
            if (this.model.get('pinned')) {
                this.trigger('result:unpin', this);
            } else {
                this.trigger('result:pin', this);
            }
            this.render();
        },
        _showAdditionalFacilities: function(displayAdditionalFacilities){
            this.model.set('showAdditionalFacilities', displayAdditionalFacilities);
            this.render();
        }
    });

    return ResultView;
});
