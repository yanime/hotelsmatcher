/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
], function ($, _, Backbone, Layout) {
    'use strict';

    var AutocompleteView = Backbone.View.extend({
        manage: true,
        template: 'autocomplete',
        url: 'http://dev.enode.ro/eanapi/autocomplete?q=',
        initialize: function (options) {
            this.currentSearch = options.value;
        },
        serialize: function () {
            return this.currentSearch;
        },
        events: {
            'keyup #destination-input': '_handleSearch',
            'dropdown:set .dropdown li': '_handleValueSet'
        },
        _handleValueSet: function (e) {
            var id, el = e.currentTarget, optionClass;

            if ( el.className.indexOf('hotels') !== -1 ) {
                optionClass = 'hotel';
            } else {
                if ( el.className.indexOf('hotels') !== -1 ) {
                    optionClass = 'city';
                }
            }

            this.trigger('select', {
                id: $(el).data('value'),
                target: optionClass,
                name: el.innerHTML.split('<span')[0]
            });
        },
        afterRender: function () {
            this._searchHelper = this.$el.find('.search.helper');
        },
        fetch: function (param) {
            var that = this;
            this._searchHelper.removeClass('hidden');
            return $.get(this.url + param).done(function(data) {
                window._searchCache = data.result;
                that.displayResults(data.result);
            });
        },
        displayResults: function ( data ) {
            var optionsEl = this.$el.find('.options'),
            tpl = this._buildResultsLists(data);

            optionsEl.find('.results')[0].innerHTML = tpl;
            this._searchHelper.addClass('hidden');
        },
        _handleSearch: function ( e ) {
            var res = e.currentTarget.value;
            this.$el.find('.result').remove();
            if(this.currentSearch === res || !res || res.length < 3){
                return ;
            }
            this.currentSearch = res;
            this.fetch(res);
        },
        _buildResultsLists: function (data) {
            var str = '', i, l, v=data, results, className,r;
            for(results in v) {
                if(v.hasOwnProperty(results)){
                    className = 'action result ' + results + ' separated ';
                    for(i = 0, l = v[results].length; i < l; i++){
                        r = v[results][i];
                        str += '<li data-value="'+r.destinationId+'" class="'+className+'">'+r.name+this._buildCountryWrapHelper(results, r.country)+'</li>';
                        className = 'action result ' + results;
                    }
                }
            }
            if (str) {
                return str;
            }
            return '<li class="result separated" >No results found</li>';
        },
        _buildCountryWrapHelper: function (type, country) {
            var res = '';
            switch (type) {
                case 'cities':
                    res = 'City,';
                    break;
                case 'hotels':
                    res = 'Hotel, ';
                    break;
                case 'landmarks':
                    res = 'Landmark, ';
                    break;
            }
            return '<span class="label">'+res+country+'</span>';
        }
    });

    return AutocompleteView;
});
