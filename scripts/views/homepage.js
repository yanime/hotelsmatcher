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
        action: null,
        manage: true,
        template: 'homepage',
        tagName: 'main',
        className: 'main wrapper clearfix',
        initialize: function () {
            this._autocompleteView = new AutocompleteView({
                value: this.model.attributes.destinationName
            });
			this.listenTo(this._autocompleteView,'select', this._handleSelect);
			

            this.requestsMappedToType = {
                "city": this._compareRequest,
                "landmark": this._landmarkRequest,
                "hotel": this._hotelRequest
            }
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

            inDate = this.$el.find('input.in').datepicker({
                onClose: this._generateScopedDatePickerHandler('checkIn')
            });
            inDate.datepicker( "option", "minDate", this.model.attributes.checkIn );
            this._setValuesInInputs(inDate, this.model.attributes.checkIn);

            outDate = this.$el.find('input.out').datepicker({
                onClose: this._generateScopedDatePickerHandler('checkOut')
            });
            outDate.datepicker( "option", "minDate", this.model.attributes.checkOut );
            this._setValuesInInputs(outDate, this.model.attributes.checkOut);
        },
        events: {
            'click .action.search': '_handleCompare',
            'click .date.setter': '_showDatePicker',
            'click .trips.checkbox.categories': '_toggleOptionsContainer',
            'click .trips.checkbox.no-date': '_toggleNoDate'
        },
        _handleSelect: function (option) {
            this.action = this._buildAction(
                this.requestsMappedToType[option.target],
                option
            );
        },
        _setValuesInInputs: function (inputs, date) {
            inputs[0].value = date.getMonth() + 1;
            inputs[1].value = date.getDate();
            inputs[2].value = date.getFullYear();
        },
        _showDatePicker: function (e) {
            var el = e.currentTarget;
            $.datepicker._showDatepicker(el.parentElement.querySelectorAll('.hasDatepicker')[0]);
        },
        _generateScopedDatePickerHandler: function (target) {
            var that = this;
			that.model.changed = true; 
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
        _setDropdownValue: function (data) {
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
					this.model.updateGuests( data );
					break;
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
                $error[0].innerText = response.readableMessage;
            }

            $error.removeClass('hidden');

            this.$el.find('.loading').addClass('hidden');
        },
        _landmarkRequest: function () {
            var dest = this.model.attributes.destinationId;
            this.model.attributes.destinationId = dest.substring(1, dest.length-1);
            this._compareRequest();
        },
        _compareRequest: function () {
            var model = this.model;

            if (model.changed) {
                model.fetch().done(function () {
                    model.changed = false;
                    App.router.navigate('compare', {
                        trigger: true
                    });
                }).fail(this._displayAPIError.bind(this));
            } else {
                App.router.navigate('compare', {
                    trigger: true
                });
            }
        },
        _buildAction: function (callback, selectionOption) {
            var that = this;
            return function () {
                callback.call(that, selectionOption);
            };
        },
        _hotelRequest: function (option) {
            var id = option.id;

            var hotel = new Result({
                id: id,
                destinationId: id,
                name: option.name,
                searchOptions: this.model.getOptionsQueryString(),
				search_options: this.model.attributes
            });

            this.model.addResult(hotel);
            this.model.pin(hotel);

            App.router.navigate('hotel/'+id, {trigger: true});
        },
        _handleCompare: function (e){
            var temp, message = "", $err, searchInput, destinationId;
			
            this.model.clearResults();
			searchInput = this.$el.find('input[name="destination"]').val();
			if(searchInput == ''){
				delete this.model.attributes.destinationId;
				delete this.model.attributes.destinationName;
			}
            e.preventDefault();
			destinationId = this.model.attributes.destinationId;
            // @NOTE assignment
            if ( ( temp = this.model.validateQueryParams() ) !== true ) {
                // display errors for compare forms;
				for (var i=0; i< temp.length; i++){
					var searchEl = this.$el.find('[data-target="'+temp[i]+'"]');
					switch(temp[i]){
						case 'destinationId':
							message += "Please verify destination or hotel name \n";
							searchEl.addClass('search-error');
							searchEl.parent().parent().addClass('error-border');
							break;
							
						case 'checkIn':
							message += "Please verify checkin date \n";
							searchEl.addClass('search-error');
							break;
							
						case 'checkOut':
							message += "Please verify checkout \n";
							searchEl.addClass('search-error');
							break;
						
						case 'rooms':
							message += "Please verify number of rooms \n";
							searchEl.addClass('search-error');
							break;
						
						case 'adults':
							message += "Please verify number of adults \n";
							searchEl.addClass('search-error');
							break;
						
						case 'children':
							message += "Please verify number of children \n";
							searchEl.addClass('search-error');
							searchEl.parent().parent().addClass('error-border');
							break;
					}
				}
				$err = this.$el.find('.api.error');
				$err[0].innerText = message;
				$err.removeClass('hidden');
				
                return false;
            }

            this.$el.find('.loading').removeClass('hidden');
			
			if(!destinationId.match(/-/g)){
				var option = {id: destinationId, name: this.model.attributes.destinationName};
				this._hotelRequest(option);
			}else{
				this._compareRequest();
			}

            return true;
        }
    });

    return HomepageView;
});
