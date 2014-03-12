/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var SearchModel = Backbone.Model.extend({
        defaults: {
            checkIn: +(new Date()),
            checkOut: +(new Date()),
            adults: 0,
            children: 0,
            rooms: 1
        },
        url: 'http://dev.enode.ro/api/hotels?q=',
        getMatches: function () {
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
