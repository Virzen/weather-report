(function (angular) {
	'use strict';

	const app = angular.module('app', []);

	/**
	 * Converts number to fixed length after decimal point.
	 * 
	 * @param {Number} number
	 * @param {Number} places
	 * @return {Number}
	 */
	const toDecimalPlaces = function (number, places) {
		const order = Math.pow(10, places);
		return Math.trunc(number * order) / order;
	};


	app.factory('position', function () {
		return {
			/**
			 * Ask user for his position and returns it if access granted.
			 * Uses JavaScript Geolocation API.
			 * Doesn't return, takes callback, which is run with position
			 * object.
			 * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
			 * 
			 * @param {Function} callback
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
		 * @return {Angular promise}
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
		$scope.tempInCelsius = true;
		$scope.info;
		$scope.message = `Waiting for geolocation data...*`;

		try {
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
		} catch (err) {
			$scope.message = `Your browser doesn't support geolocation, which is required for the application to work.
			Please make sure you're using the latest version of your browser.`;
		}

		/**
		 * Toggles temperature between Celsius and Fahrenheit units.
		 */
		$scope.toggleTempUnit = function toggleTempUnit() {
			const temp = $scope.info.main.temp;
			if (typeof temp !== 'number') {
				if ($scope.tempInCelsius) {
					$scope.info.main.temp = toDecimalPlaces(temp * 1.8 + 32, 2);
				} else {
					$scope.info.main.temp = toDecimalPlaces((temp - 32) / 1.8, 2);
				}

				$scope.tempInCelsius = !$scope.tempInCelsius;
			} else {
				throw new Error('No temperature data available.');
			}
		};
	}]);
}(angular));
/*global angular*/
