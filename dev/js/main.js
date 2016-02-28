(function (angular) {
	'use strict';

	const app = angular.module('app', []);


	app.factory('position', function () {
		return {
			/**
			 * Ask user for his position and returns it if access granted.
			 * Uses JavaScript Geolocation API.
			 * Doesn't return, takes callback, which is run with position
			 * object.
			 * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
			 */
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
		/**
		 * Calls to Open Weather API with given coords.
		 * `coords` is an object with `latitude` and `longitude` properties.
		 *
		 * @return Angular promise
		 */
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
		$scope.message = `Please allow for geolocation detection.
		Retrieved data is not stored nor used to track you.`;

		position.get(position => {
			$scope.message = `Retrieving weather data...`;
			coords = position.coords;

			weather.get(coords)
				.success((data, status) => {
					$scope.message = ``;
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


}(angular));
/*global angular*/
