// by dribehance <dribehance.kksdapp.com>
angular.module("Uelives").directive('countdown', function($interval) {
	return {
		restrict: 'E',
		scope: {
			countdown: "=",
			disabled: "=countdownDisabled"
		},
		link: function(scope, element, attrs) {
			// function body
			var counting = false;
			$(element).bind("click", function(e) {
				if (scope.disabled || counting) {
					return;
				}
				countdown();
			})

			function countdown() {
				var last_message = scope.countdown.message,
					count = parseFloat(scope.countdown.count) ? parseFloat(scope.countdown.count) : 60;
				counting = true;
				scope.$apply(function() {
					scope.countdown.message = count--;
					scope.countdown.message = count + "s重新获取";
					scope.countdown.mode = "disabled";
					scope.countdown.reset = false;
					scope.countdown.callback();
				});
				var timer = $interval(function() {
					scope.countdown.message = count--;
					scope.countdown.message = count + "s重新获取";
					if (count < 0 || scope.countdown.reset) {
						$interval.cancel(timer);
						scope.countdown.message = last_message;
						counting = false;
					}
				}, 1000)
			}
		}
	};
});