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
        className: function () {
            if (this.model.pinned) {
                return 'hotel info column fixed pinned';
            }
            return 'hotel info column fixed unpinned';
        },
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
        }
    });

    return ResultView;
});
