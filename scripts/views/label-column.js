/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager'
], function ($, _, Backbone, Layout) {
    'use strict';

    var LabelColumn = Backbone.View.extend({
        manage: true,
        template: 'label-column',
        className: "book"
    });

    return LabelColumn;
});
