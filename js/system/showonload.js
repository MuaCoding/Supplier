angular.module("showonLoad",[])

.directive('showOnLoaded', function() {
	return {
		link: function(scope, element, attrs) {
			$(element).css({
				"visibility": "hidden"
			})
			element.bind('load', function() {
				console.log("loaded")
				var rate = parseFloat(scope.$eval($(element).parent().attr("data-rate")));
				if (!rate) {
					console.log("unexpect rate")
					return;
				}
				var actural_rate = $(element).width() / $(element).height();
				if (actural_rate < rate) {
					$(element).css({
						"height": "100%",
						"width": "auto"
					})
				} else {
					$(element).css({
						"height": "auto",
						"width": "100%"
					})
				}
				$(element).parent().css({
					"background": "none"
				})
				$(element).css({
					"visibility": "visible"
				})
			});
		}
	}
});