/*global define*/
define([
    'underscore',
    'backbone',
    'layoutmanager',
    'models/api-call'
], function (_, Backbone, Layout, ApiCall) {
    'use strict';

    var ResultModel = Backbone.Model.extend({
        _baseURL: "http://dev.enode.ro/eanapi/hotel-detail?hotelId=",
        _baseDeepLink: "http://www.travelnow.com/templates/55505/hotels/",
        _parseHelper: $('<textarea/>'),
        manage: true,
        template: 'results',
        initialize: function (options) {
            var deepLink;

            this.pinned = false;
            this.loaded = false;
            this.id = this.attributes.id || this.attributes.hotelId;

            deepLink = this._baseDeepLink + this.id + "/overview?lang=en_US";
            if (options.searchOptions) {
                deepLink += options.searchOptions;
            }
            this.attributes.deepLink = deepLink;
        },
        _extractImage: function (image) {
            return {
                thumbnailUrl: image.thumbnailUrl,
                url: image.url
            };
        },
        _extractRoom: function (room) {
            return {
                name: room.description,
                description: room.descriptionLong
            };
        },
        _extractFacilities: function (facility) {
            return facility.amenity.trim();
        },
        _parse: function (res) {
            var desc = this._parseHelper.html(res.HotelDetails.propertyDescription).text().replace(/<br \/>/g,'');

            this.attributes.description = desc;

            this.attributes.city = res.HotelSummary.city;
            this.attributes.address = res.HotelSummary.address1;

            if (res.HotelImages.HotelImage) {
                this.attributes.images = _.map(res.HotelImages.HotelImage, this._extractImage);
            }

            if (res.RoomTypes.RoomType) {
                this.attributes.rooms = _.map(res.RoomTypes.RoomType, this._extractRoom);
            }

            if (res.PropertyAmenities) {
                this.attributes.facilities = _.map(res.PropertyAmenities.PropertyAmenity, this._extractFacilities);
            }

            this.trigger('result:update');
        },
        fetch: function () {
            var url = this._baseURL + this.id;
            if (!this.loaded) {
                this.loaded = true;
            }
            return new ApiCall(url).status.done(this._parse.bind(this));
        }
    });

    return ResultModel;
});
