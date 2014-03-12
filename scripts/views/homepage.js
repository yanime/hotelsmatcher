/*global define*/
/*global App*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    '../views/autocomplete',
    '../models/search'
], function ($, _, Backbone, Layout, AutocompleteView, Search) {
    'use strict';

    var HomepageView = Backbone.Layout.extend({
        manage: true,
        template: 'homepage',
        tagName: 'main',
        className: 'main wrapper clearfix',
        initialize: function () {
            this.model = new Search();
        },
        beforeRender: function () {
            this.insertView('#search-wrapper', new AutocompleteView());
        },
        afterRender: function () {
            window.DropdownController.handle();
            this.listenTo(window.DropdownController,'set',this._setDropdownValue);
        },
        events: {
            'click .action.search': '_handleCompare',
            'click .trips.checkbox.categories': '_toggleOptionsContainer',
            'click .trips.checkbox:not(.categories)': '_toggleOption',
            'click button.reset': 'resetOptions'
        },
        resetOptions: function () {
            var option, options = Search.options, val;
            for (option in options) {
                if (options.hasOwnProperty(option)) {
                    val = options[option];
                    if (this.model.attributes[val]) {
                        this.model.set(val, false);
                        this.$el.find('.'+option).removeClass('active').find('input').val('');
                    }
                }
            }
            console.log(this.model.attributes);
        },
        _setDropdownValue: function (data) {
            var temp;
            switch (data.target) {
                case 'guests':
                    if (data.value === "more") {
                        this.$el.find('.options .hidden').removeClass('hidden');
                        return;
                    }
                    break;
                case 'adults':
                    temp = this.model.attributes.children;
                    this.model.set('guests', Number(data.value) + Number(temp));
                    break;
                case 'children':
                    temp = this.model.attributes.adults;
                    this.model.set('guests', Number(data.value) + Number(temp));
                    break;
                case 'destination':
                    this.model.set("destination-name",data.display);
                    break;
                case 'guests':
                    break;
            }

            this.model.set(data.target,data.value);
            console.log(this.model.attributes);
        },
        _toggleOptionsContainer: function (e) {
            var $this = $(e.currentTarget),
            target = $this.data('target');

            $('.filters.'+target).toggleClass('hidden');
            $this.toggleClass('active');
        },
        _toggleOption: function (e) {
            var $this = $(e.currentTarget),
            $item = $this.find('input[type="hidden"]'),
            id;

            $this.toggleClass('active');
            id = $item[0].id
            this.model.set(id, !this.model.attributes[id]);
            console.log(this.model.attributes);
            $item.val($this.hasClass('active'));
        },
        _handleCompare: function (e){
            e.preventDefault();
            App.search = this.model;
            App.router.navigate('compare',{trigger: true});
        }
    });

    return HomepageView;
});
