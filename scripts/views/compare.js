/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'views/results',
    'views/pagination'
], function ($, _, Backbone, Layout, ResultsView, PaginationView) {
    'use strict';

    var CompareView = Backbone.View.extend({
        manage: true,
        tagName: 'main',
        className: 'main wrapper clearfix',
        template: 'compare',
        initialize: function () {

            var results = this.model.results.length,
                pinned = this.model.pinnedResults.length;
		
            var counts = {
                page: 0,
                results: results,
                countPinned: pinned,
                countUnpinnedPerPage: 6 - pinned,
                countPages: Math.ceil ( ( results - pinned ) / ( 6 - pinned ) )
            };

            this.resultsView = new ResultsView({
                model: this.model,
                counts: counts
            });
            this.topPagination = new PaginationView({
                model: this.model.results,
                counts: counts
            });
            this.bottomPagination = new PaginationView({
                model: this.model.results,
                counts: counts
            });

            this.resultsView.connectPaginationView(this.topPagination);
            this.resultsView.connectPaginationView(this.bottomPagination);

            this.bottomPagination.listenTo(this.topPagination, 'change', this.bottomPagination.syncDisplay);
            this.topPagination.listenTo(this.bottomPagination, 'change', this.topPagination.syncDisplay);
        },
        events: {
            'click .button.edit': "_handleChangeSearch",
            'click .push-button': "_handleSortChange"
        },
        _handleChangeSearch: function () {
            App.router.navigate('index',{trigger: true});
        },
        _handleSortChange: function (e) {
            var currentElement = e.currentTarget;
            var type = currentElement.dataset.type;
            if (!$(currentElement).hasClass('active')){
                $('.push-button.active').removeClass('active');
                $(currentElement).addClass('active');
                this.resultsView.sortHotelsByType(type);
                this.topPagination._resetPaginationAndGoToFirstPage();
            }
        },
        serialize: function () {
            return this.model.attributes;
        },
        beforeRender: function () {
            this.insertView('#results', this.resultsView);
            this.insertView('.pagination.top', this.topPagination);
            this.insertView('.pagination.bottom', this.bottomPagination);
        },
		afterRender: function(){
			if(!this.model.attributes.check_distance){
				this.$el.find(".trips.distance").addClass('hidden');
			}else{
				this.$el.find(".trips.distance").removeClass('hidden')
			}
		}
    });

    return CompareView;
});
