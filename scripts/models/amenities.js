define([],
    function () {
        var amenities = function () {
            this.selected = [];
        };

        amenities.prototype.select = function (option) {
            this.selected[option] = true;
        };

        amenities.prototype.select = function (option) {
            this.selected[option] = true;
        };

        amenities.options = [{
            name: 'Business Center',
            check: function () {
            }
        }
        ];
        return amenities;
    });
