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
        defaults: {
            "pinned":  false
        },

        initialize: function (options) {
            var deepLink, searchOptions, kidsPerRoom = 3, lastKid;

            this.pinned = false;
            this.loaded = false;
            this.id = this.attributes.id || this.attributes.hotelId;
			
			if(options.highRate)
				this.attributes.highRate = Math.floor(options.highRate);

            deepLink = this._baseDeepLink + this.id + "/overview?lang=en_US";
            if (options.search_options) {
				var dateSearch;
				
				if(options.search_options['checkIn'] && options.search_options['checkOut'] ){
				var checkIn = $.datepicker.formatDate('mm/dd/yy', options.search_options['checkIn']), 
				    checkOut = $.datepicker.formatDate('mm/dd/yy',options.search_options['checkOut']);
					dateSearch = '&checkout=' + checkOut.replace(/\//g,'%2F') + '&checkin=' + checkIn.replace(/\//g,'%2F');
				}
				searchOptions = dateSearch + '&roomsCount=' + options.search_options['rooms'];
				if(options.search_options['rooms'] >= 1){
					searchOptions += this._adultsPerRoom(options.search_options);
				}
				
                deepLink += searchOptions;
            }
            this.attributes.deepLink = deepLink;
            this.attributes.facilities = [];
        },
		_adultsPerRoom: function(data){
			var adultsPerRoom, lastAdult, url='';
			
			adultsPerRoom = data['adults'] / data['rooms'];
			adultsPerRoom = Math.floor(adultsPerRoom);
			var nrAdults = adultsPerRoom * data['rooms'];
			
			if( nrAdults == data['adults']){
				for (var i = 0; i < data['rooms']; i++){
					url += '&rooms%5b' + i + '%5d.adultsCount=' + adultsPerRoom;
					url += this._childrenPerRoom(data);
				}
			}else{
				lastAdult = data['adults'] - nrAdults;
				for (var i = 0; i < data['rooms']; i++){
					if(i == data['rooms'] - 1){
						lastAdult +=adultsPerRoom;
						url += '&rooms%5b' + i + '%5d.adultsCount=' + lastAdult ;
					}else{
						url += '&rooms%5b' + i + '%5d.adultsCount=' + adultsPerRoom;
					}
					url += this._childrenPerRoom(data);
				}
			}
			return url;
		},
		_childrenPerRoom: function(data){
			var link = '', childrenPerRoom, lastChild;
			
			if(data['children'] > 0){
				childrenPerRoom = data['children'] / data['rooms'];
				childrenPerRoom = Math.floor(childrenPerRoom);
				var nrChildren = childrenPerRoom * data['rooms'];
				
				if( nrChildren == data['children']){
					for (var i = 0; i < data['rooms']; i++){
						link += '&rooms%5b' + i + '%5d.childrenCount=' + childrenPerRoom;
						for( var j = 0; j< childrenPerRoom; j++){
							link += '&rooms%5b' + i + '%5d.children%5b' + j + '%5d.age=' + 5;
						}
					}
				}else{
					lastChild = data['children'] - nrChildren;
					for (var i = 0; i < data['rooms']; i++){
						if(i == data['rooms'] - 1){
							lastChild +=childrenPerRoom;
							link += '&rooms%5b' + i + '%5d.childrenCount=' + lastChild ;
							for( var j = 0; j< lastChild; j++){
								link += '&rooms%5b' + i + '%5d.children%5b' + j + '%5d.age=' + 5;
							}
						}else{
							link += '&rooms%5b' + i + '%5d.childrenCount=' + childrenPerRoom;
							for( var j = 0; j< childrenPerRoom; j++){
								link += '&rooms%5b' + i + '%5d.children%5b' + j + '%5d.age=' + 5;
							}
						}
					}
				}
			}
			
			return link;
			
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
			if(res){
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

				if(res.HotelSummary.highRate && !this.attributes.highRate){

					this.attributes.highRate = (res.HotelSummary.lowRate > 0) ? Math.floor((res.HotelSummary.highRate+res.HotelSummary.lowRate)/2) : Math.floor(res.HotelSummary.highRate);
				}

				this.trigger('result:update');
			}
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
