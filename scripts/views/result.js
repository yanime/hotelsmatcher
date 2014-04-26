/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
], function ($, _, Backbone, Layout) {
    'use strict';

    var ResultView = Backbone.View.extend({
        manage: true,
        className: 'hotel info column fixed',
        template: 'result',
        events: {
            'click .pin': '_handleResultPinned'
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

            this.model.pinned = !this.model.pinned;
        }
    });

    return ResultView;
});
