/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'layoutmanager',
	'views/result',
	'views/lightbox',
    'views/label-column'
], function ($, _, Backbone, Layout, ResultView, LightboxView, LabelColumn) {
	'use strict';

	var PIN = 1,
        UNPIN = -1;

	var ResultsView = Backbone.View.extend({
		manage: true,
		className: 'compare-table',
		template: 'results',
		page: 0,
		paginationTop: null,
		paginationBottom: null,
		initialize: function (options) {
			this.counts = options.counts;

			this.lightboxView = new LightboxView();
            this.labelColumn = new LabelColumn({
                model: this.model
            });
		},
		events: {
			'mouseover .result .header': '_displayLightbox',
			'click .check-more' : '_toggleFacilitiesList',
            'click .option.checkbox:not(.blocked)': '_toggleOption'
		},
		_insertViews: function (collection, where, forceRender) {
			var i, l = collection.length, v, view;

			for (i = 0; i < l; i++) {
				v = collection[i];

				// @todo find a way to wait for updates

				view = new ResultView({
					model: v
				});

				v.fetch();

				if (where) {
					this.insertView(where, view);
				} else {
					this.insertView(view);
				}

				if (forceRender) {
					view.render();
				}

				this.listenTo(view, 'result:pin', this._handlePin);
				this.listenTo(view, 'result:unpin', this._handleUnpin);
			}
		},
		_addPinnedResults: function () {
			this._insertViews(this.model.pinnedResults, '.pinned-container');
		},
		_addPagedUnpinnedResults: function (forceRender) {
			var arr = this.model.getUnpinned(
					this.counts.countUnpinnedPerPage,
					this.counts.page * this.counts.countUnpinnedPerPage
            );

			this._insertViews(arr, false, forceRender);
		},
		beforeRender: function () {
            this.insertView('.label-container', this.labelColumn);
			this._addPinnedResults();
			this._addPagedUnpinnedResults();

			this.insertView(this.lightboxView);
		},
		afterRender: function () {
			this._cachedDOMPinned = this.$el.find('.pinned-container');
			if (this.counts.countPinned) {
				this._cachedDOMPinned.removeClass('hidden');
			}
		},
		connectTopPaginationView: function (paginationView) {
			this.listenTo(paginationView, 'change', this._handlePaginationChange);
			this.paginationTop = paginationView;


		},
		connectBottomPaginationView: function (paginationView) {
			this.listenTo(paginationView, 'change', this._handlePaginationChange);
			this.paginationBottom = paginationView;

		},
		sortHotelsByType: function (sortType) {
            this.model.sortResults(sortType);
            this._handlePaginationChange();
		},
		_handlePaginationChange: function () {
			var views = this.getViews();
			var i = 0;

			while (i < views._wrapped.length) {

				if (views._wrapped[i].model &&
                    !views._wrapped[i].model.get('pinned') &&
                    views._wrapped[i].cid !== this.lightboxView.cid &&
                    views._wrapped[i].cid !== this.labelColumn.cid) {
					views._wrapped[i].remove();
				}
				i++;
			}

			this._addPagedUnpinnedResults(true);
			if (window.scrollY > 373) {
				window.scrollTo(0, 373);
			}
            if(this.lightboxView){
                this.lightboxView.close();
            }
		},
		_handlePin: function (view) {
            var element = view.$el;
            this._cachedDOMPinned.append(element);

            this.model.pin(view.model);

            view.refreshEvents();

            if (this.counts.countPinned === 0) {
                this._cachedDOMPinned.removeClass('hidden');
            }

            this._updateCountsFor(PIN);
            if(this.lightboxView){
                this.lightboxView.close();
            }

            if(this.counts.countPinned == 5 ){
                var views = this.getViews();
                var i = 0;

                this.model.displayPinButton(false);

                while (i < views._wrapped.length) {

                    if (views._wrapped[i].model &&
                        !views._wrapped[i].model.get('pinned') &&
                        views._wrapped[i].cid !== this.lightboxView.cid) {
                        views._wrapped[i].render();
                    }
                    i++;
                }
            }
		},
		_updateCountsFor: function (action) {
			this.counts.countPinned += action;
			this.counts.countUnpinnedPerPage -= action;
			this.counts.countPages = Math.ceil((this.counts.results - this.counts.countPinned) / (6 - this.counts.countPinned));
			this.paginationTop._handlePinnedAction(this.counts.countPages);
			this.paginationBottom._handlePinnedAction(this.counts.countPages);
		},
		_handleUnpin: function (view) {
			if(this.counts.countPinned === 5) {

                var views = this.getViews();
                var i = 0;

                this.model.displayPinButton(true);

                while (i < views._wrapped.length) {

                    if (views._wrapped[i].model &&
                        !views._wrapped[i].model.get('pinned')){
                        views._wrapped[i].render();
                    }
                    i++;
                }
			}
			var element = view.$el;

			element.remove();
			element.removeClass('pinned');
			element.addClass('unpinned');
			this.$el.append(element);

			view.refreshEvents();

			var hotel = view.model;
			this.model.unpin(hotel);
			this.model.results.remove(hotel);

			var pos = 6 * this.page + this.countUnpinnedPerPage;
			this.model.results.add(hotel, {at: pos});

			this._updateCountsFor(UNPIN);

			if (this.counts.countPinned === 0) {
				this._cachedDOMPinned.addClass('hidden');
			}
            if(this.lightboxView){
                this.lightboxView.close();
            }
			this.trigger('result:pin');
        },
		_displayLightbox: function (e) {
			var parent = e.currentTarget.parentElement,
					id = parent.id,
					marginLeft = $(parent).position().left;

			this.lightboxView.handle(App.Search.results.get(id));

            //strange behavior when the div is rendered in the container of pinned results
            //todo find why the offset left is different
            if(this.lightboxView.getState()){
                this.lightboxView.displayAt(marginLeft + 173);
            } else {
                this.lightboxView.displayAt(marginLeft);
            }
		},
		_toggleFacilitiesList: function() {
			this.model.set('additionalFacilities', !this.model.get('additionalFacilities'));
            this.labelColumn.render();
            var views = this.getViews();
            var i = 0;

            while (i < views._wrapped.length) {
                if (views._wrapped[i].cid !== this.lightboxView.cid && views._wrapped[i].cid !== this.labelColumn.cid) {
                    views._wrapped[i]._showAdditionalFacilities(this.model.get('additionalFacilities'));
                }
                i++;
            }
		},
        _toggleOption: function (e) {
            var $this = $(e.currentTarget),
                $item = $this.find('input[type="hidden"]'),
                id = {item: '', value: ''};

            var views = this.getViews();
            var i = 0;

            $this.toggleClass('active');
            id.item = $item[0].id;
            ($this.hasClass('active')) ? id.value = true : id.value = false ;
			this.model.attributes.facilities[id.item].value = id.value;
            $item.val($this.hasClass('active'));
            while (i < views._wrapped.length) {
                if (views._wrapped[i].cid !== this.lightboxView.cid) {
                    views._wrapped[i].render();
                }
                i++;
            }
        }
	});

	return ResultsView;
});
