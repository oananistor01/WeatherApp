const inputCity = document.getElementById("city-input");
const weatherBtn = document.getElementById("weather-btn");
const errorMsg = document.getElementById("error-msg");
const weatherCard = document.getElementById("weather-card");
const forecastBtn = document.getElementById("forecast-btn");
const forecastSection = document.querySelector(".bottom-section");

//adding an extra 0 if the hour is a number under 10. instead of 9:00 it shows 09:00, or instead of 17:8, it shows 17:08
function addZero(j) {
  if (j < 10) {
    j = "0" + j;
  }
  return j;
}

//show weather when clicking the 'show weather button'
weatherBtn.addEventListener("click", (e) => {
  e.preventDefault();

  //verifying if the user has entered any city name
  if (inputCity.value == "") {
    errorMsg.innerHTML = "*Please enter a city!";
    return;
  }
  //if input is valid fetch the information
  else {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=" +
        inputCity.value
    )
      .then((response) => response.json())
      .then((data) => {
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0].icon}.svg`; // another type of icons `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        //creating the current date and hour
        let date = new Date().toDateString();

        let newDate = new Date();
        let h = addZero(newDate.getHours());
        let m = addZero(newDate.getMinutes());
        let hour = h + ":" + m;

        //creating the weather card
        let output = `
                        <div class="card">
                            <h3 class="city-name">${inputCity.value}, 
                            ${data.sys.country}</h3>
                            <p class="date">${date}, ${hour}</p>
                            <h1 class="temperature">${Math.round(
                              data.main.temp
                            )}<span>°C</span></h1>
                            <img class="weather-icon" src="${icon}"/>
                            <p class="weahter-description">${
                              data.weather[0].description
                            }</p>
                            <p class="detailed-temp">Min. temp: ${Math.round(
                              data.main.temp_min
                            )}°C</p>
                            <p class="detailed-temp">Max. temp: ${Math.round(
                              data.main.temp_max
                            )}°C</p>
                            <p class="detailed-temp">Humidity: ${
                              data.main.humidity
                            }%</p>
                            <p class="detailed-temp">Pressure: ${
                              data.main.pressure
                            } hPa</p>
                        </div>
                    `;

        weatherCard.innerHTML = output;
        errorMsg.innerHTML = "";
      });
  }
});

//show 6 day forcast when clicking the 'show forecast button'
forecastBtn.addEventListener("click", (e) => {
  e.preventDefault();

  forecastSection.innerHTML = ""; //reseting the forecast section, so it doesn't add another 6 days to the list

  if (inputCity.value == "") {
    errorMsg.innerHTML = "*Please enter a city!";
    return;
  } else {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=" +
        inputCity.value
    )
      .then((response) => response.json())
      .then((data) => {
        //creating the 6 day foreast cards
        for (let i = 0; i <= data.list.length - 1; i++) {
          const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[i].weather[0].icon}.svg`;

          //creating the format of the forecast's date and hour
          let month = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          let d = new Date(data.list[i].dt * 1000);
          let cardMonth = month[d.getMonth()];
          let cardDay = addZero(d.getDate());
          let cardHour = addZero(d.getHours());

          let output = document.createElement("div"); //creating a div where the cards will be inserted
          output.classList.add("card", "forecast-card"); //adding the classes to the div

          //creating the card output
          output.innerHTML = `
                        <p class="forecast-date">${cardMonth}, ${cardDay}</p>
                        <p class="forecast-date">${cardHour}:00</p>
                        <h3 class="city-name">${inputCity.value}</h3>
                        <h1 class="temperature">${Math.round(
                          data.list[i].main.temp
                        )}<span>°C</span></h1>
                        <img class="weather-icon" src="${icon}"/>
                        <p class="weahter-description">${
                          data.list[i].weather[0].description
                        }</p>
                    `;

          let today = new Date(data.list[0].dt * 1000).getDate(); //getting todays date in order to compare it with the cards date

          //compare card's day with today and display the forecast days on sepparate rows
          if (cardDay == today) {
            output.style.gridRow = "1";
          } else if (cardDay == today + 1) {
            output.style.gridRow = "2";
          } else if (cardDay == today + 2) {
            output.style.gridRow = "3";
          } else if (cardDay == today + 3) {
            output.style.gridRow = "4";
          } else if (cardDay == today + 4) {
            output.style.gridRow = "5";
          } else if (cardDay == today + 5) {
            output.style.gridRow = "6";
          }

          forecastSection.appendChild(output);
          errorMsg.innerHTML = "";
        }
      });
  }
});
