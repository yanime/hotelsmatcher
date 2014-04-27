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
            'click .read': '_handleReadMoreToggle',
            'click .view': '_handleViewAllToggle',
            'click .book': '_handleBook',
            'click .compare': '_handleCompare'
        },
        serialize: function () {
            return this.model.attributes;
        },
        afterRender: function () {
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
        },
        _handleBook: function () {
        }
    });

    return HotelView;
});
