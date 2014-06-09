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
            'click .close': '_handleClosePage',
            'click .compare': '_handleCompareRequest'
        },
        afterRender: function () {
            var that = this;
            this.model.fetch().done(function () {
                var view = new HotelView({model: that.model});
                that.$el.find('.loading').remove();
                that.insertView('#main-section', view);
                view.render();
            });
        },
        _handleCompareRequest: function () {
            App.Search.fetchHotelsNearHotel(this.model).done(function () {
                App.router.navigate('compare',{trigger: true});
            });
        },
        _handleClosePage: function () {
            App.router.navigate('index',{trigger: true});
        }
    });

    return HotelPageView;
});
