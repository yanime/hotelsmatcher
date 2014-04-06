/*global define*/
/*global App*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    '../views/autocomplete',
    '../vendor/jquery-ui-1.10.4.custom.min',
], function ($, _, Backbone, Layout, AutocompleteView, Search) {
    'use strict';

    var HomepageView = Backbone.Layout.extend({
        manage: true,
        template: 'homepage',
        tagName: 'main',
        className: 'main wrapper clearfix',
        serialize: function () {
            return this.model.attributes;
        },
        beforeRender: function () {
            this.insertView('#search-wrapper', new AutocompleteView());
        },
        datePickerOptions: {
            onClose: function(e){
                var res = e.split('/');
                if (res.length > 1) {
                    this.parentElement.querySelector('.month').value = res[0][0] == 0 ? res[0][1] : res[0];
                    this.parentElement.querySelector('.day').value = res[1][0] == 0 ? res[1][1] : res[1];
                    this.parentElement.querySelector('.year').value = res[2];
                }
            }
        },
        afterRender: function () {
            var inDate, outDate, today = new Date();

            window.DropdownController.handle();
            this.listenTo(window.DropdownController,'set',this._setDropdownValue);

            inDate = this.$el.find('#check-in-month').datepicker(this.datePickerOptions);
            inDate.datepicker( "option", "minDate", today );
            inDate.datepicker( "option", "defaultDate", today );

            outDate = this.$el.find('#check-out-month').datepicker(this.datePickerOptions);
            outDate.datepicker( "option", "minDate", new Date( today.getTime() + 24 * 60 * 60 * 1000 ) );
        },
        events: {
            'click .action.search': '_handleCompare',
            'click .trips.checkbox.categories': '_toggleOptionsContainer',
            'click .trips.checkbox:not(.blocked)': '_toggleOption',
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
                case 'destinationId':
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
            id = $item[0].id;
            this.model.set(id, !this.model.attributes[id]);
            console.log(this.model.attributes);
            $item.val($this.hasClass('active'));
        },
        _displayAPIError: function () {
            window.scrollTo(0,0);
            this.$el.find('.api.error').removeClass('hidden');
        },
        _handleCompare: function (e){
            e.preventDefault();
            this.model.fetch().done(function () {
                App.router.navigate('compare',{trigger: true});
            }).fail(this._displayAPIError.bind(this));
        }
    });

    return HomepageView;
});
