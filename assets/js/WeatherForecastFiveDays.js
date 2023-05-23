"use strict";
const weekday = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

function getForecast(lat, lon) {
	const result = new Promise((resolve, reject) => {
		const apiUrl =
			baseWeatherMapUrl +
			`/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

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
	});
	result.then(
		function (response) {
			const { list } = response;

			var ForeCastData = "";

			// Since the free API provides only hourly forecast for each day. We get the first hourly forecast of each day.
			// The first hourly weather of a particular day is found by comparing the current datum's date and the previous datum's date
			// The weather data is in sorted order based on the date and time
			for (var i = 1; i < 40; i++) {
				const previous_date = list[i - 1].dt_txt.split(" ")[0];
				const current_date = list[i].dt_txt.split(" ")[0];

				if (current_date != previous_date) {
					const d = new Date(current_date);
					const day = weekday[d.getDay()];

					const { weather } = list[i];

					const { temp } = list[i].main;
					const tempInCelsius = Math.floor((temp - 273.15) * 100) / 100;

					const { main, description, icon } = weather[0];
					const DayData = `<div class='col-xs-6 col-sm-6 col-md-3 col-lg-2  my-3 
                    '>

                        <div class="card shadow-sm  my-border-radius" >
                            <img class="card-img-top" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Card image cap">
                            <div class="card-body">
								<p>${day}</p>
                                <h5 class="card-title">${main}</h5>
                                <p class="card-text">${description}</p>
                                
                            </div>
                            <div class='card-footer'>
                            <p>
                                    ${tempInCelsius} &deg C
                                </p>
                            </div>
                        </div>

                        
                        </div>`;

					ForeCastData += DayData;
				}
			}

			forecast_section.innerHTML = ForeCastData;
		},
		function (errorMessage) {
			console.error(errorMessage);
		},
	);
}
