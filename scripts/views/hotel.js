/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
], function ($, _, Backbone, Layout) {
    'use strict';

    var HotelView = Backbone.View.extend({
        manage: true,
        template: 'hotel',
        events: {
            'click .read': '_handleReadMore',
            'click .book': '_handleBook',
            'click .compare': '_handleCompare'
        },
        serialize: function () {
            return this.model.attributes;
        },
        afterRender: function () {
        },
        _handleReadMore: function () {
            this.$el.find('.description-container .description').toggleClass('expanded');
        },
        _handleBook: function () {
        }
    });

    return HotelView;
});
