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
        setTemplate: function () {
            if (this._useThumbnails) {
                this.template = 'hotel-images-thumbs';
            } else {
                this.template = 'hotel-images';
            }
        },
        events: {
            'click .next': '_handleNextRequest',
            'click .previous': '_handlePreviousRequest'
        },
        initialize: function (options) {
            this._currentImage = 0;
            this._useThumbnails = options.useThumbnails;
            this.setTemplate();
        },
        serialize: function () {
            if (this.model) {
                this._numberOfImages = this.model.length;
            }
            return this.model;
        },
        _updateImage: function () {
            var image;
            // @NOTE assignment
            if ( ( image = this.model[this._currentImage] ) ) {
                this.el.querySelector('img').src = image.url;
            }
        },
        _handleNextRequest: function () {
            if (this._currentImage === this._numberOfImages) {
                this._currentImage = 0;
            } else {
                this._currentImage++;
            }

            this._updateImage();
        },
        _handlePreviousRequest: function () {
            if (this._currentImage === 0) {
                this._currentImage = this._numberOfImages;
            } else {
                this._currentImage--;
            }

            this._updateImage();
        }
    });

    return HotelImagesView;
});
