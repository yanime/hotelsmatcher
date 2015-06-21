define([
    'underscore',
], function (_) {
    'use strict';

    var ApiCall  = function(url) {
        this.call = $.get(url).always(this._parse.bind(this));
        this.status = jQuery.Deferred();
    };
    ApiCall.prototype._parse = function(data) {
        var res;

        // error handling
        if ( ( res = data.HotelListResponse ) ||
            ( res = data.HotelInformationResponse ) ) {
            if (res.EanWsError) {
                return this.status.reject({
                    reason: res.EanWsError.category,
                    readableMessage: res.EanWsError.presentationMessage
                });
            }
        }

        return this.status.resolve(res);
    };

    return ApiCall;
});
