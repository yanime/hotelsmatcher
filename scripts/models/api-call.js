define([
    'underscore',
], function (_) {
    'use strict';

    var ApiCall  = function(url) {
        this.call = $.get(url).always(this._parse.bind(this));
        this.status = jQuery.Deferred();
    };
    ApiCall.prototype._parse = function(data) {
        data = data.HotelListResponse;
        if (data.EanWsError) {
            return this.status.rejectWith({
                reason: data.EanWsError.category,
                readableMessage: data.EanWsError.presentationMessage
            });
        }
        return this.status.resolve(data);
    };

    return ApiCall;
});
