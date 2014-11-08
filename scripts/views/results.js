/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'layoutmanager',
	'views/result',
	'views/lightbox',
], function ($, _, Backbone, Layout, ResultView, LightboxView) {
	'use strict';

	var PIN = 1,
			UNPIN = -1;

	var ResultsView = Backbone.View.extend({
		manage: true,
		className: 'compare-table',
		template: 'results',
		page: 0,
		initialize: function (options) {
			this.counts = options.counts;

			this.lightboxView = new LightboxView();
		},
		events: {
			'mouseover .result .header': '_displayLightbox',
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
				this.listenTo(view, 'result:lightbox', this._handleLightboxRequest);
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

			this._insertViews(arr, undefined, forceRender);
		},
		beforeRender: function () {
			this._addPinnedResults();
			this._addPagedUnpinnedResults();

			this.insertView(this.lightboxView);
		},
		afterRender: function () {
			this._cachedDOMPinned = this.$el.find('.pinned-container');
			if (this.counts.countPinned) {
				this._cachedDOMPinned.removeClass('hidden');
			}
			var i;
			for (i in this.model.attributes.facilities) {
				if (this.model.attributes.facilities[i] == true) {
					switch (i) {
						case 'wifi':
							this.$el.find(".option.checkbox.wifi").removeClass('unchecked').addClass('checked');
							break;

						case 'parking':
							this.$el.find(".option.checkbox.parking").removeClass('unchecked').addClass('checked');
							break;

						case 'airport_shuttle':
							this.$el.find(".option.checkbox.airport_shuttle").removeClass('unchecked').addClass('checked');
							break;

						case 'fitness_center':
							this.$el.find(".option.checkbox.fitness_center").removeClass('unchecked').addClass('checked');
							break;

						case 'spa':
							this.$el.find(".option.checkbox.spa").removeClass('unchecked').addClass('checked');
							break;
					}

				}
			}
		},
		connectPaginationView: function (paginationView) {
			this.listenTo(paginationView, 'change', this._handlePaginationChange);
			paginationView.listenTo(this, 'result:pin', paginationView._handlePinnedAction);
		},
		_handlePaginationChange: function (newPage) {
			var views = this.getViews();
			var i = 1;
			var temp;

			while (i <= this.counts.countUnpinnedPerPage) {
				// @note assignment
				if ((temp = views._wrapped[6 - i])) {
					temp.remove();
				}
				i++;
			}

			this._addPagedUnpinnedResults(true);

			if (window.scrollY > 373) {
				window.scrollTo(0, 373);
			}
		},
		_handlePin: function (view) {
			var element = view.$el;
			var hotel = view.model;

			element.removeClass('unpinned');
			element.addClass('pinned');
			element.remove();
			this._cachedDOMPinned.append(element);

			this.model.pin(view.model);

			view.refreshEvents();

			if (this.counts.countPinned === 0) {
				this._cachedDOMPinned.removeClass('hidden');
			}

			this._updateCountsFor(PIN);

			this.trigger('result:pin');
		},
		_updateCountsFor: function (action) {
			this.counts.countPinned += action;
			this.counts.countUnpinnedPerPage -= action;
			this.counts.countPages = Math.ceil((this.counts.results - this.counts.countPinned) / (6 - this.counts.countPinned));
		},
		_handleUnpin: function (view) {
			var element = view.$el;

			element.remove();
			element.removeClass('pinned');
			element.addClass('unpinned');
			this.$el.append(element);

			view.refreshEvents();

			var hotel = view.model;
			this.model.unpin(hotel);
			this.model.results.remove(hotel);

			var pos = this.countResultsPerPage * this.page + this.countUnpinnedPerPage;
			this.model.results.add(hotel, {at: pos});

			this._updateCountsFor(UNPIN);

			if (this.counts.countPinned === 0) {
				this._cachedDOMPinned.addClass('hidden');
			}
			this.trigger('result:pin');
		},
		_displayLightbox: function (e) {
			var parent = e.currentTarget.parentElement,
					id = parent.id,
					marginLeft = $(parent).position().left;

			this.lightboxView.handle(App.Search.results.get(id));
			this.lightboxView.displayAt(marginLeft);
		}
	});

	return ResultsView;
});
