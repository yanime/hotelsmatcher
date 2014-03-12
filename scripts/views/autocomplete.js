/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager'
], function ($, _, Backbone) {
    'use strict';

    var AutocompleteView = Backbone.View.extend({
        manage: true,
        template: 'autocomplete',
        url: 'http://dev.enode.ro/api/autocomplete?q=',
        initialize: function () {
            this.currentSearch = '';
        },
        events: {
            'keyup #destination-input': '_handleSearch'
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
                        str += '<li data-value="'+r.destinationId+'" class="'+className+'">'+r.name+this._labels[results]+'</li>';
                        className = 'action result ' + results;
                    }
                }
            }
            if (str) {
                return str;
            }
            return '<li class="result separated" >No results found</li>';
        },
        _labels:{
            'cities': '<span class="label">City</span>',
            'hotels': '<span class="label">Hotel</span>',
            'landmarks': '<span class="label">Landmark</span>'
        }
    });

    return AutocompleteView;
});
