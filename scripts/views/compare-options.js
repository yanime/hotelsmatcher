/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'layoutmanager'
], function ($, _, Backbone) {
	'use strict';

	var CompareOptionsView = Backbone.View.extend({
		manage: true,
		template: 'compare-options',
		events: {
			'click .trips.checkbox:not(.blocked)': '_toggleOption',
			'click button.reset': 'resetOptions'
		},
		_toggleOption: function (e) {
			var $this = $(e.currentTarget),
					$item = $this.find('input[type="hidden"]'),
					id = {item: '', value: ''};

			$this.toggleClass('active');
			id.item = $item[0].id;
			($this.hasClass('active')) ? id.value = true : id.value = false ;
			if (id.item) {
				if(id.item == 'check_distance'){
					this.model.attributes.check_distance = id.value;
				}else{
					this.model.attributes.facilities[id.item].value = id.value;
				}
			}
			$item.val($this.hasClass('active'));
		},
		resetOptions: function () {
			var option, options = this.model.constructor.options, val;
			for (option in options) {
				if (options.hasOwnProperty(option)) {
					val = options[option];
					if (this.model.attributes[val]) {
						this.model.set(val, false);
						this.$el.find('.' + option).removeClass('active').find('input').val('');
					}
				}
			}
		}
	});

	return CompareOptionsView;
});
