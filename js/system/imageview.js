angular.module('imageview', [])

.directive('imageview', function($timeout) {
		return {
			restrict: 'E',
			scope: {
				src: "="
			},
			controller: function($scope, $element, $attrs) {
				$scope.bg_image = "/images/default.png";
				$scope.rate = parseFloat($attrs.rate);
				$scope.width = $element.parent().width() || $(window).width();
				$scope.height = $scope.width / $scope.rate;
				if (!$scope.rate) {
					console.log("unexpect rate")
					return;
				}
				this.show_center_on_loaded = function(e) {
					calculate_center_image_size_on_loaded(e);
					$timeout(function() {
						calculate_center_image_size_on_loaded(e);
					}, 100)
				}
				this.show_on_loaded = function(e) {
					calculate_image_size_on_loaded(e);
					$timeout(function() {
						calculate_image_size_on_loaded(e);
					}, 100)
				}

				function calculate_center_image_size_on_loaded(e) {
					$(e.target).css({
						width: 'auto',
						height: 'auto'
					})
					var image_loaded = $(e.target),
						image_loaded_width = image_loaded.width(),
						image_loaded_height = image_loaded.height(),
						actural_rate = parseFloat(image_loaded_width) / parseFloat(image_loaded_height);
					if (actural_rate < $scope.rate) {
						image_loaded_width = $scope.width;
						image_loaded_height = $scope.width / actural_rate
						image_loaded.css({
							"display": "inline-block",
							"height": image_loaded_height,
							"width": image_loaded_width,
							"margin-top": -(image_loaded_height - $scope.height) / 2
						})
					} else {
						image_loaded_height = $scope.height
						image_loaded_width = image_loaded_height * actural_rate;
						image_loaded.css({
							"display": "inline-block",
							"height": image_loaded_height,
							"width": image_loaded_width,
							"margin-left": -(image_loaded_width - $scope.width) / 2
						})
					}
					image_loaded.parent().css({
						"background": "none"
					})
					image_loaded.css({
						"visibility": "visible"
					})
				}

				function calculate_image_size_on_loaded(e) {
					var image_loaded = $(e.target),
						image_loaded_width = image_loaded.width(),
						image_loaded_height = image_loaded.height(),
						actural_rate = parseFloat(image_loaded_width) / parseFloat(image_loaded_height);
					if (actural_rate < $scope.rate) {
						image_loaded.css({
							"display": "inline-block",
							"height": "100%",
							"width": "auto"
						})
					} else {
						image_loaded.css({
							"display": "inline-block",
							"height": "auto",
							"width": "100%"
						})
					}
					image_loaded.parent().css({
						"background": "none"
					})
					image_loaded.css({
						"visibility": "visible"
					})
				}
			},
			template: function(element, attrs) {
				var template = "<img ng-src='{{src}}' show-center-on-loaded err-src='../images/default.png'>";
				if ($(element).attr('center-only') == undefined) {
					template = "<img ng-src='{{src}}' show-on-loaded err-src='../images/default.png'>"
				}
				return template;
			},
			link: function(scope, element, attrs, ctrl) {
				var style = {
					display: "block",
					width: scope.width,
					overflow: "hidden",
					"text-align": "center",
					"background-image": "url(" + scope.bg_image + ")",
					"background-position": "center center",
					"background-repeat": "no-repeat",
					"height": scope.height,
					"overflow": "hidden"
				}
				$(element).css(style);
			}
		};
	})
	.directive('showOnLoaded', function() {
		return {
			restrict: "A",
			require: "^imageview",
			link: function(scope, element, attrs, ctrl) {
				element.bind('load', ctrl.show_on_loaded);
			}
		}
	}).directive('showCenterOnLoaded', function() {
		return {
			restrict: "A",
			require: "^imageview",
			link: function(scope, element, attrs, ctrl) {
				element.bind('load', ctrl.show_center_on_loaded);
			}
		}
	});