/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'models/result'
], function ($, _, Backbone, Layout, Result) {
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
            var model, id, el = e.currentTarget;

            if ( el.className.indexOf('hotels') !== -1 ) {
                id = $(el).data('value');

                id = id + '';
                model = new Result({
                    id: id,
                    destinationId: id,
                    name: el.innerHTML.split('<span')[0]
                });

                App.Search.results.add(model);

                App.router.navigate('hotel/'+id, {trigger: true});
            }
        },
        afterRender: function () {
            this._searchHelper = this.$el.find('.search.helper');
        },
        fetch: function (param) {
            var that = this;
            this._searchHelper.removeClass('hidden');
            return $.get(this.url + param).done(function(data) {
                that.displayResults(data.result);
            });
        },
        displayResults: function ( data ) {
            var optionsEl = this.$el.find('.options'),
            tpl = this._buildResultsLists(data);

            optionsEl.append(tpl);
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
