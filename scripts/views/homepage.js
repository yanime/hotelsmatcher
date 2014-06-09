/*global define*/
/*global App*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    '../views/autocomplete',
    '../views/compare-options',
    'models/result',
    '../vendor/jquery-ui-1.10.4.custom.min'
], function ($, _, Backbone, Layout, AutocompleteView, CompareOptionsView, Result) {
    'use strict';

    var HomepageView = Backbone.Layout.extend({
        manage: true,
        template: 'homepage',
        tagName: 'main',
        className: 'main wrapper clearfix',
        initialize: function () {
            this._autocompleteView = new AutocompleteView({
                value: this.model.attributes.destinationName
            });
            this.listenTo(this._autocompleteView,'select:hotel', this._handleHotelSelect);
        },
        serialize: function () {
            return this.model.attributes;
        },
        beforeRender: function () {
            this.insertView('#search-wrapper', this._autocompleteView);
            this.insertView('#comparisson-wrapper', new CompareOptionsView({
                model: this.model
            }));
        },
        afterRender: function () {
            var inDate, outDate;

            window.DropdownController.handle();
            this.listenTo(window.DropdownController,'set',this._setDropdownValue);

            inDate = this.$el.find('#check-in-month').datepicker({
                onClose: this._generateScopedDatePickerHandler('checkIn')
            });
            inDate.datepicker( "option", "minDate", this.model.attributes.checkIn );
            inDate.val( this.model.attributes.checkIn.getMonth() + 1 );

            outDate = this.$el.find('#check-out-month').datepicker({
                onClose: this._generateScopedDatePickerHandler('checkOut')
            });
            outDate.datepicker( "option", "minDate", this.model.attributes.checkOut );
            outDate.val( this.model.attributes.checkOut.getMonth() + 1 );
        },
        events: {
            'click .action.search': '_handleCompare',
            'click .date.setter': '_showDatePicker',
            'click .trips.checkbox.categories': '_toggleOptionsContainer',
            'click .trips.checkbox.no-date': '_toggleNoDate'
        },
        _showDatePicker: function (e) {
            var el = e.currentTarget;
            $.datepicker._showDatepicker(el.parentElement.querySelectorAll('.hasDatepicker')[0]);
        },
        _generateScopedDatePickerHandler: function (target) {
            var that = this;
            return function (date) {
                var res = date.split('/');
                if (res.length > 1) {
                    this.parentElement.querySelector('.month').value = res[0][0] == 0 ? res[0][1] : res[0];
                    this.parentElement.querySelector('.day').value = res[1][0] == 0 ? res[1][1] : res[1];
                    this.parentElement.querySelector('.year').value = res[2];
                }
                that.model.setDate(target, new Date(date));
            };
        },
        _handleHotelSelect: function (option) {
            var id = option.id;

            this.model.clearResults();

            var hotel = new Result({
                id: id,
                destinationId: id,
                name: option.name,
                searchOptions: this.model.getOptionsQueryString()
            });

            this.model.addResult(hotel);
            this.model.pin(hotel);

            App.router.navigate('hotel/'+id, {trigger: true});
        },
        _setDropdownValue: function (data) {
            var temp;
            switch (data.target) {
                case 'guests':
                    if (data.value === "more") {
                        this.$el.find('.options .hidden').removeClass('hidden');
                        return;
                    }
                    if (data.value === "1") {
                        // @todo got to also reset values if they were checked
                        this.$el.find('.options .rooms').addClass('hidden');
                        this.$el.find('.options .adults').addClass('hidden');
                        this.$el.find('.options .children').addClass('hidden');

                        this.model.attributes.adults = 1;
                        this.model.attributes.rooms = 1;
                        this.model.attributes.children = 0;
                        this.model.attributes.guests = 1;
                    }
                    break;
                case 'adults':
                case 'children':
                    this.model.updateGuests( data );
                    break;
                case 'destinationId':
                    this.model.set("destinationName",data.display);
                default:
                    this.model.attributes[data.target] = data.value;
                    break;
            }

            this.model.changed = true;
        },
        _toggleOptionsContainer: function (e) {
            var $this = $(e.currentTarget),
            target = $this.data('target');

            $('.filters.'+target).toggleClass('hidden');
            $this.toggleClass('active');
        },
        _toggleNoDate: function (e) {
            $(e.currentTarget).toggleClass('active');
            this.model.attributes.withDate = !this.model.attributes.withDate;
        },
        _displayAPIError: function (response) {
            var $error;

            window.scrollTo(0,0);

            $error = this.$el.find('.api.error');

            if (response.reason === "AUTHENTICATION") {
                $error[0].innerText = "We cannot service this request. Please contact support.";
            } else {
                $error[0].innerText = "We have encountered an error. Please contact support.";
            }

            $error.removeClass('hidden');

            this.$el.find('.loading').addClass('hidden');
        },
        _handleCompare: function (e){
            var temp,
            model = this.model;

            model.clearResults();

            e.preventDefault();

            // @NOTE assignment
            if ( ( temp = this.model.validateQueryParams() ) !== true ) {
                // @TODO display errors;
                console.log('@TODO Handle field not populated');
                console.log(temp);
                return false;
            }

            this.$el.find('.loading').removeClass('hidden');

            if (model.changed) {
                model.fetch().done(function () {
                    model.changed = false;
                    App.router.navigate('compare',{trigger: true});
                }).fail(this._displayAPIError.bind(this));
            } else {
                App.router.navigate('compare',{trigger: true});
            }

            return true;
        }
    });

    return HomepageView;
});
