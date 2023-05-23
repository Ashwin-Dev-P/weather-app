"use strict";
const baseWeatherMapUrl = `https://api.openweathermap.org`;

const currentWeatherDiv = document.getElementById("currentWeather");
const forecast_section = document.getElementById("forecast");

function getWeather(city) {
	currentWeatherDiv.style.visibility = "visible";

	// Loading spinner
	currentWeatherDiv.innerHTML = `<div class='my-2 bg-primary shadow-sm p-5  my-border-radius'>
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`;
	forecast_section.innerHTML = `
        <div class='col-xs-12 offset-md-5 col-md-2 offset-lg-5 col-lg-2 text-center mt-5'>
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        <div>`;

	const result = new Promise((resolve, reject) => {
		const apiUrl =
			baseWeatherMapUrl + `/data/2.5/weather?q=${city}&appid=${apiKey}`;

		var xhr = new XMLHttpRequest();
		xhr.responseType = "json"; //1
		xhr.open("GET", apiUrl);
		xhr.send();
		xhr.onload = function () {
			if (xhr.status != 200) {
				//2
				console.error("XMLHttpRequest error: " + xhr.status);
				return;
			}
			//3
			resolve(xhr.response);
		};
		xhr.onerror = function () {
			//4
			console.error("XMLHttpRequest Request failed");
			reject("Something went wrong");
			console.error(xhr.response);
		};

		// const options = {
		// 	method: "GET",
		// 	headers: {},
		// };
		// fetch(apiUrl, options)
		// 	.then((response) => {
		// 		console.log(response);
		// 		console.log(response.body);
		// 	})
		// 	.catch((error) => {
		// 		console.error(error);
		// 	});
	});
	result.then(
		function (response) {
			console.log(response);

			const { weather, coord } = response;
			const { temp } = response.main;
			if (weather) {
				var { main, description, icon } = weather[0];
			}

			const image = `<img src='https://openweathermap.org/img/wn/${icon}@2x.png' />`;
			currentWeatherDiv.innerHTML = `<div class="text-center shadow-sm p-4 bg-primary  my-border-radius">
						<div id="weather-image">${image}</div>
						<p>Today</p>
						<p id="main-weather">${main}</p>
						<p id="description">${description}</p>
                        <p>
                            ${Math.floor((temp - 273.15) * 100) / 100} &deg C
                        </p>
					</div>`;
			main;
			//document.getElementById("description").innerHTML = description;

			const { lon, lat } = coord;
			getForecast(lat, lon);
		},
		function (errorMessage) {
			console.error(errorMessage);
		},
	);
}

var select = document.querySelector("#cities");

select.addEventListener("change", function (e) {
	getWeather(e.target.value);
});
