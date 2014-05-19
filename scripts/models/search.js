/*global define*/

define([
    'underscore',
    'backbone',
    'collections/results',
    'models/result',
    'models/api-call',
], function (_, Backbone, Results, Result, ApiCall) {
    'use strict';
    var today = new Date();

    var SearchModel = Backbone.Model.extend({
        url: 'http://dev.enode.ro/eanapi/hotels?',
        defaults: {
            checkIn: today,
            checkOut: new Date(today.getTime() + (24 * 60 * 60 * 1000)),
            withDate: true,
            adults: 2,
            children: 0,
            rooms: 1
        },
        initialize: function () {
            this.results = new Results();
            this.pinnedResults = [];
        },
        getUnpinned: function (count, from){
            var i = 0,
                res = [],
                v,
                found = 0,
                failsafe = this.results.length;

            from = from || 0;

            while ( found < count && i < failsafe ){
                v = this.results.at(i);
                if (!v.pinned) {
                    if (from) {
                        from--;
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
            result.pinned = true;
            this.pinnedResults.push(result);
        },
        unpin: function (result) {
            for (var i = 0, l = this.pinnedResults.length; i < l; i ++) {
                if (this.pinnedResults[i] === result) {
                    this.pinnedResults.splice(i,1);
                    result.pinned = false;
                    return true;
                }
            }
            return false;
        },
        formatDate: function (date) {
            return ( date.getMonth() ) + 1 + '/' + date.getDate() + '/' + date.getFullYear();
        },
        validateQueryParams: function () {
            var attr = this.attributes,
            errors = [];

            if ( attr.destinationId === undefined ){
                errors[errors.length] = 'destinationId';
            }
            if ( attr.checkIn === undefined ){
                errors[errors.length] = 'checkIn';
            }
            if ( attr.checkOut === undefined ){
                errors[errors.length] = 'checkOut';
            }
            if ( attr.rooms === undefined ){
                errors[errors.length] = 'rooms';
            }
            if ( attr.adults === undefined ) {
                errors[errors.length] = 'adults';
            }

            return errors.length ? errors : true;
        },
        getOptionsQueryString: function () {
            var attr = this.attributes,
            room = 0,
            i = 0,
            url = '';

            if (attr.withDate) {
                url += '&from='+this.formatDate(attr.checkIn);
                url += '&to='+this.formatDate(attr.checkOut);
            }

            var adultsPerRoom = attr.rooms / attr.adults;
            adultsPerRoom = Math.floor(adultsPerRoom);

            // @todo fix issue where one adult is swallowed by floor
            while ( room < attr.rooms ) {
                url += '&room'+(room+1);
                url += '='+adultsPerRoom;

                if ( i < attr.children ) {
                    url += ',5';
                    i++;
                }

                room++;
            }

            if ( i < attr.children ) {
                while ( i < attr.children ){
                    url += ',5';
                    i++;
                }
            }

            return url;
        },
        getQueryString: function () {
            var attr = this.attributes,
            url = '';

            url += 'destinationId='+attr.destinationId;
            url += this.getOptionsQueryString();

            return url;
        },
        fetch: function () {
            // http://dev.enode.ro/api/hotels?destinationId=003B6BAD-728C-4067-AB5A-B93C0EE6D0EA&from=12%2F20%2F2013&to=12%2F23%2F2013&room1=1,8,2,3
            return new ApiCall(this.url + this.getQueryString()).status.done(this._parse.bind(this));
        },
        _parse: function (data) {
            var results, hotels;
            hotels = data.HotelList.HotelSummary;
            for (var i = 0, l = hotels.length; i < l; i ++) {
                this.results.addSearchResult(hotels[i]);
            }
        }
    },{
        options: {
            'wifi': 'wifi-option',
            'parking': 'parking-option',
            'airport-shuttle': 'airport-shuttle-option',
            'fitness-center': 'fitness-center-option',
            'spa': 'spa-option',
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
