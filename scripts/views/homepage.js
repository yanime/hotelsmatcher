/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    '../views/autocomplete'
], function ($, _, Backbone, Layout, AutocompleteView) {
    'use strict';

    var HomepageView = Backbone.Layout.extend({
        manage: true,
        template: 'homepage',
        tagName: 'main',
        className: 'main wrapper clearfix',
        beforeRender: function () {
            this.insertView('#search-wrapper', new AutocompleteView());
        }
    });

    return HomepageView;
});
