/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager'
], function ($, _, Backbone, Layout) {
    'use strict';

    var HotelImagesView = Backbone.View.extend({
        manage: true,
        template: 'hotel-images',
        events: {
            'click .next': '_handleNextRequest',
            'click .previous': '_handlePreviousRequest'
        },
        initialize: function () {
            this._currentImage = 0;
            this._numberOfImages = this.model.length;
        },
        serialize: function () {
            return this.model;
        },
        _handleNextRequest: function () {
            var image;

            if (this._currentImage === this._numberOfImages) {
                this._currentImage = 0;
            } else {
                this._currentImage++;
            }

            // @NOTE assignment
            if ( ( image = this.model[this._currentImage] ) ) {
                this.el.querySelector('img').src = image.url;
            }
        },
        _handlePreviousRequest: function () {
            var image;

            if (this._currentImage === 0) {
                this._currentImage = this._numberOfImages;
            } else {
                this._currentImage--;
            }

            // @NOTE assignment
            if ( ( image = this.model[this._currentImage] ) ) {
                this.el.querySelector('img').src = image.url;
            }
        }
    });

    return HotelImagesView;
});
