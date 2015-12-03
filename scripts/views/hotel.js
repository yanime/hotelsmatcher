/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'views/hotel-images'
], function ($, _, Backbone, Layout, HotelImages) {
    'use strict';

    var HotelView = Backbone.View.extend({
        manage: true,
        template: 'hotel',
        events: {
            'click .read': '_handleReadMoreToggle',
            'click .view': '_handleViewAllToggle',
            'click .compare': '_handleCompare'
        },
        serialize: function () {
            return this.model.attributes;
        },
        beforeRender: function () {
            this.insertView('.hotel.photos', new HotelImages({
                model: this.model.attributes.images
            }));
        },
        _handleReadMoreToggle: function () {
            this.$el.find('.description-container .description').toggleClass('expanded');
        },
        _handleViewAllToggle: function (e) {
            var el = e.currentTarget.parentElement;

            if (el.className.indexOf('expanded') !== -1) {
                el.className = el.className.replace(' expanded','');
            } else {
                el.className += ' expanded';
            }
        }
    });

    return HotelView;
});
