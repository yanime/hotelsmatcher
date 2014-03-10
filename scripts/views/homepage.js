/*global define*/
/*global App*/

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
        },
        events: {
            'click .action.search': '_handleCompare'
        },
        _handleCompare: function (e){
            e.preventDefault();
            App.router.navigate('compare',{trigger: true});
        }
    });

    return HomepageView;
});
