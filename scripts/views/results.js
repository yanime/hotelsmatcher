/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
], function ($, _, Backbone, Layout) {
    'use strict';

    var ResultsView = Backbone.View.extend({
        manage: true,
        className: 'compare-table',
        template: 'results',
        pinHotel: function (e) {
            this.$el.find('.pinned-container').append(e.currentTarget.parentElement.parentElement);
        },
        serialize: function () {
            return this.model;
        },
        afterRender: function () {
            if (this.model) {
                var events = {
                    'click .trips.pin': 'pinHotel'
                };
                this.delegateEvents(events);
            }
        }
    });

    return ResultsView;
});
