/*global define*/
/*global App*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    '../views/autocomplete',
    '../views/compare-options',
    '../vendor/jquery-ui-1.10.4.custom.min',
], function ($, _, Backbone, Layout, AutocompleteView, CompareOptionsView) {
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
            this.insertView('#comparisson-wrapper', new CompareOptionsView({
                model: this.model
            }));
        },
        afterRender: function () {
            var inDate, outDate,
            datePickerOptions = {
                onClose: this._generateScopedDatePickerHandler()
            };

            window.DropdownController.handle();
            this.listenTo(window.DropdownController,'set',this._setDropdownValue);

            inDate = this.$el.find('#check-in-month').datepicker(datePickerOptions);
            inDate.datepicker( "option", "minDate", this.model.attributes.checkIn );
            inDate.val( this.model.attributes.checkIn.getMonth() + 1 );

            outDate = this.$el.find('#check-out-month').datepicker(datePickerOptions);
            outDate.datepicker( "option", "minDate", this.model.attributes.checkOut );
            outDate.val( this.model.attributes.checkOut.getMonth() + 1 );
        },
        events: {
            'click .action.search': '_handleCompare',
            'click .date.setter': '_resetDate',
            'click .trips.checkbox.categories': '_toggleOptionsContainer'
        },
        _resetDate: function (e) {
            var date = new Date(),
            el = e.currentTarget;

            if ($(e.currentTarget).hasClass('today')) {
                this.model.attributes.checkIn = date;
            } else {
                date = new Date(date.getTime() + (24 * 60 * 60 * 1000));
                this.model.attributes.checkOut = date;
            }

            el.parentElement.querySelector('.month').value = date.getMonth() + 1;
            el.parentElement.querySelector('.day').value = date.getDate();
            el.parentElement.querySelector('.year').value = date.getFullYear();
        },
        _generateScopedDatePickerHandler: function () {
            var that = this;
            return function (date) {
                var res = date.split('/');
                if (res.length > 1) {
                    this.parentElement.querySelector('.month').value = res[0][0] == 0 ? res[0][1] : res[0];
                    this.parentElement.querySelector('.day').value = res[1][0] == 0 ? res[1][1] : res[1];
                    this.parentElement.querySelector('.year').value = res[2];
                }
                that.model.attributes.checkIn = new Date(date);
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
        },
        _toggleOptionsContainer: function (e) {
            var $this = $(e.currentTarget),
            target = $this.data('target');

            $('.filters.'+target).toggleClass('hidden');
            $this.toggleClass('active');
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
            var temp;
            e.preventDefault();

            // @NOTE assignment
            if ( ( temp = this.model.validateQueryParams() ) !== true ) {
                // @TODO display errors;
                console.log('@TODO Handle field not populated');
                console.log(temp);
                return false;
            }

            this.$el.find('.loading').removeClass('hidden');

            this.model.fetch().done(function () {
                App.router.navigate('compare',{trigger: true});
            }).fail(this._displayAPIError.bind(this));
        }
    });

    return HomepageView;
});
