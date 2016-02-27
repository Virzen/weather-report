(function (R, angular) {
	'use strict';

	const app = angular.module('app', []);

	app.factory('position', function () {
		return {
			get(callback) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(position => {
						callback(position);
					});
				}
				else {
					throw new Error('Geolocation is not supported.');
				}
			}
		};
	});

	app.factory('weather', ['$http', function ($http) {
		return {
			get(coords) {
				return $http({
					method: 'GET',
					url: `//api.openweathermap.org/data/2.5/weather?
						lat=${coords.latitude}&
						lon=${coords.longitude}&
						units=metric
						&APPID=53299179b5fcbbc0f5fdc79c783c7f69`
				});
			}
		};
	}]);

	app.controller('MainCtrl', ['$scope', 'position', 'weather', function ($scope, position, weather) {
		let coords;
		$scope.info;

		position.get(position => {
			coords = position.coords;

			weather.get(coords)
				.success((data, status) => {
					$scope.info = data;
				})
				.error((data, status) => {
					throw new Error('Request status:', status);
				});
		});
	}]);
	// 
	// app.directive('superButton', function () {
	// 	return {
	// 		restrict: 'A',
	// 		replace: true,
	// 		transclude: true,
	// 		template: `	<button type="button" class="super-button" ng-transclude>
	// 						Stuff
	// 					</button>`,
	// 		link: function (scope, element, attrs) {
	// 			// DOM manipulation/events
	// 		}
	// 	};
	// });


}(R, angular));
/*global R, angular*/
