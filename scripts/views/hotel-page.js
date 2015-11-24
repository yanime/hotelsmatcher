/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'views/hotel'
], function ($, _, Backbone, Layout, HotelView) {
    'use strict';

    var HotelPageView = Backbone.View.extend({
        manage: true,
        tagName: 'main',
        className: 'main wrapper clearfix',
        template: 'hotel-page',
        events: {
            'click .close': '_handleCompareRequest',
            'click .compare': '_handleCompareRequest'
        },
        block: function () {
            this.$el.find('.loading').removeClass('hidden');
        },
        unblock: function () {
            this.$el.find('.loading').addClass('hidden');
        },
        afterRender: function () {
            var that = this;
            this.model.fetch().done(function () {
                var view = new HotelView({model: that.model});
                that.insertView('#main-section', view);
                view.render();
                that.unblock();
            });
        },
        _handleCompareRequest: function () {
            App.Search.fetchHotelsNearHotel(this.model).done(function(){
                App.router.navigate('compare',{trigger: true});
            })
        }
    });

    return HotelPageView;
});
