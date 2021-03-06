/*global define*/

define([
    'underscore',
    'backbone',
    'moment',
    'collections/results',
    'models/result',
    'models/api-call',
    'models/country-code-converter'
], function (_, Backbone, momentjs, Results, Result, ApiCall, CountryCodeConverter) {
    'use strict';
    var today = new Date();

    var SearchModel = Backbone.Model.extend({
        url: 'http://dev.enode.ro/eanapi/hotels?',
        defaults: {
            checkIn: null,
            checkOut: null,
            withDate: true,
            adults: 2,
            children: 0,
            rooms: 1,
            guests: 2,
            additionalFacilities: false,
            facilities: {
                'wifi': {
                    value: true,
                    label: 'Wifi',
                    compare_option: true,
                    api_label: 'Free WiFi'
                },
                'breakfast': {
                    label: 'Breakfast',
                    value: false,
                    compare_option: true,
                    api_label: 'Free breakfast'
                },
                'parking': {
                    label: 'Parking',
                    value: false,
                    compare_option: true,
                    api_label: 'Free self parking'
                },
                'airport_shuttle': {
                    label: 'Airport Shuttle',
                    value: false,
                    compare_option: true,
                    api_value: 'Airport transportation (surcharge)'
                },
                'fitness_center': {
                    label: 'Fitness Center',
                    value: false,
                    compare_option: true,
                    api_label: 'Fitness facilities'
                },
                'spa': {
                    label: 'Spa',
                    value: false,
                    compare_option: false,
                    api_label: 'Spa services on site'
                },
                'pool': {
                    label: 'Pool',
                    value: false,
                    compare_option: false,
                    api_label: 'Indoor pool'
                },
                'kitchen': {
                    label: 'Kitchen',
                    value: false,
                    compare_option: false,
                    api_value: 'Full kitchen'
                },
                'pets_allowed': {
                    label: 'Pets allowed',
                    value: false,
                    compare_option: false,
                    api_label: 'Pets allowed'
                }
            }
        },
        initialize: function () {
            this.setDate('checkIn', today);
            this.setDate('checkOut', new Date(today.getTime() + (24 * 60 * 60 * 1000)));
            this.results = new Results();
            this.pinnedResults = [];
        },
        setDate: function (attr, value) {
            this.attributes[attr] = value;
            this.attributes['formatted_' + attr] = momentjs(value).format("MMM. Do YYYY");
        },
        updateGuests: function (from) {
            var attrs = this.attributes;

            attrs[from.target] = Number(from.value);
            attrs.guests = attrs.adults + attrs.children;
        },
        addResult: function (hotel) {
            this.results.add(hotel);
        },
        getUnpinned: function (count, skip) {
            var i = 0,
                res = [],
                v,
                found = 0,
                failsafe = this.results.length;

            skip = skip || 0;

            while (found < count && i < failsafe) {
                v = this.results.at(i);
                if (!v.attributes.pinned) {
                    if (skip) {
                        skip--;
                    } else {
                        res.push(v);
                        found++;
                    }
                }
                i++;
            }
            return res;
        },
        pin: function (result) {
            result.set({pinned: true});
            this.pinnedResults.push(result);
        },
        unpin: function (result) {
            for (var i = 0, l = this.pinnedResults.length; i < l; i++) {
                if (this.pinnedResults[i] === result) {
                    this.pinnedResults.splice(i, 1);
                    result.set({pinned: false});
                    return true;
                }
            }
            return false;
        },
        sortResults: function (sortType) {
            this.results.sortModels(sortType);
        },
        displayPinButton: function (displayPinButton) {
            this.results.forEach(function (model) {
                if (!model.get('pinned')) {
                    model.set('showPinButton', displayPinButton);
                }
            });
        },
        formatDate: function (date) {
            return ( date.getMonth() ) + 1 + '/' + date.getDate() + '/' + date.getFullYear();
        },
        validateQueryParams: function () {
            var attr = this.attributes,
                errors = [];

            if (attr.destinationId === undefined) {
                errors[errors.length] = 'destinationId';
            }
            if (attr.checkIn === undefined && attr.withDate) {
                errors[errors.length] = 'checkIn';
            }
            if (attr.checkOut === undefined && attr.withDate) {
                errors[errors.length] = 'checkOut';
            }
            if ((attr.checkIn > attr.checkOut) && attr.withDate) {
                errors[errors.length] = 'calendar'
            }
            if (attr.rooms === undefined) {
                errors[errors.length] = 'rooms';
            }
            if (attr.adults === undefined) {
                errors[errors.length] = 'adults';
            }
            if (attr.children === undefined) {
                errors[errors.length] = 'children';
            }
            if (errors.length) {
                errors[attr] = this.attributes;
                return errors;
            } else {
                return true;
            }
        },
        getOptionsQueryString: function () {
            var attr = this.attributes,
                room = 0,
                i = 0,
                url = '';

            if (attr.withDate) {
                url += '&from=' + this.formatDate(attr.checkIn);
                url += '&to=' + this.formatDate(attr.checkOut);
            }

            var adultsPerRoom = attr.adults / attr.rooms;
            adultsPerRoom = Math.floor(adultsPerRoom);

            // @todo fix issue where one adult is swallowed by floor
            while (room < attr.rooms) {
                url += '&room' + (room + 1);
                url += '=' + adultsPerRoom;

                if (i < attr.children) {
                    url += ',5';
                    i++;
                }

                room++;
            }

            if (i < attr.children) {
                while (i < attr.children) {
                    url += ',5';
                    i++;
                }
            }

            return url;
        },
        getQueryString: function () {
            var attr = this.attributes,
                url = '';

            url += 'destinationId=' + attr.destinationId;
            url += this.getOptionsQueryString();

            return url;
        },
        clearResults: function () {
            this.results.reset();
            this.pinnedResults.length = 0;
        },
        fetch: function () {
            // http://dev.enode.ro/api/hotels?destinationId=003B6BAD-728C-4067-AB5A-B93C0EE6D0EA&from=12%2F20%2F2013&to=12%2F23%2F2013&room1=1,8,2,3
            return new ApiCall(this.url + this.getQueryString()).status.done(this._parse.bind(this));
        },
        fetchHotelsNearHotel: function (hotel) {
            var countryName = new CountryCodeConverter().getCountryNameByCode(hotel.attributes.countryCode.toUpperCase());
            var that = this;
            var dfd = jQuery.Deferred();

            $.get('http://dev.enode.ro/eanapi/autocomplete?q=' + hotel.attributes.city).done(function (data) {
                for (var i = 0, l = data.result.cities.length; i < l; i++) {
                    var v = data.result.cities[i];
                    if (hotel.attributes.city === v.name && countryName === v.country) {
                        that.attributes.destinationId = v.destinationId;
                        that.fetch().done(function () {
                            dfd.resolve();
                        });
                    }
                }
            });

            return dfd.promise();
        },
        _parse: function (data) {
            var hotels;
            hotels = data.HotelList.HotelSummary;
            if (hotels.length) {
                for (var i = 0, l = hotels.length; i < l; i++) {
                    hotels[i]['search_options'] = this.attributes;
                    this.results.addSearchResult(hotels[i]);
                }
            } else {
                // one result is not wrapped in an array
                hotels['search_options'] = this.attributes;
                this.results.addSearchResult(hotels);
            }
        }
    }, {
        options: {
            'wifi': 'wifi',
            'parking': 'parking',
            'airport-shuttle': 'airport_shuttle',
            'fitness-center': 'fitness_center',
            'family': 'family-option',
            'business': 'business-option',
            'romance': 'romance-option',
            'budget': 'budget-option',
            'tripadvisor': 'check-tripadvisor',
            'distance': 'check-distance',
            'price': 'check-price',
            'stars': 'check-stars'
        }
    });

    return SearchModel;
});
