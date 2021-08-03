var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var CampsiteList = document.querySelector("tbody");
var datePickerEl = document.querySelector("#datepicker");
var tableBody = document.getElementById("recWebLink");
//datepicker

$("#datepicker").datepicker({
  changeMonth: true,
  changeYear: true,
});
// var formSubmitHandler = function(){
//   var zipCode = localStorage.getItem('city');
//   if(zipCode){
//       searchRecAreas(zipCode);
//       cityInputEl.value = "";
//   } else{
//       alert("Please enter a City");
//   }
// }
var zipCode = localStorage.getItem("city");

// First Search - Get method RecID
function searchRecAreas(zipCode) {
  // var apiKey = "064e9eb3-9b5a-4ba5-8127-32d6b2871560"
  var zipCodeQueryUrl =
    "https://ridb.recreation.gov/api/v1/recareaaddresses?limit=5&offset=0&query=" +
    zipCode +
    "&apikey=064e9eb3-9b5a-4ba5-8127-32d6b2871560";
  fetch(zipCodeQueryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      searchFacilities(data.RECDATA);
    });
}
// Second Search - Get method- Facility_Name
function searchFacilities(recData) {
  for (var i = 0; i < recData.length; i++) {
    //Each Rec Area ID
    var recAreaID = recData[i].RecAreaID;
    var recAreaUrl =
      "https://ridb.recreation.gov/api/v1/recareas/" +
      recAreaID +
      "?full=true&apikey=064e9eb3-9b5a-4ba5-8127-32d6b2871560";
    fetch(recAreaUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.FACILITY) {
          searchCampsite(data.FACILITY);
          var FacilityNames = data.FACILITY;
          var link = document.createElement("a");
          //Facility Name
          for (var i = 0; i < FacilityNames.length; i++) {
            // var listItem = document.createElement('tr');
            link.textContent = FacilityNames[i].FacilityName;
            //Append the li element to the id associated with the ul element.
            //  CampsiteList.appendChild(listItem);
            console.log(data.FACILITY);
            console.log(FacilityNames[i].FacilityName);
          }
            var mediaNames = data.MEDIA;
            for (var i = 0; i < mediaNames.length; i++) {
              var webImage = document.createElement("img");
              webImage.src = mediaNames[i].URL;
              tableBody.append(webImage);
              console.log(mediaNames);
              console.log(mediaNames[i].URL);
            }
            // Retreiving website URLS
              var linkNames = data.LINK;

              //Link Name
              for (var i = 0; i < linkNames.length; i++) {
                // var listItem = document.createElement('tr');
                var createTableRow = document.createElement("tr");
                var tableData = document.createElement("td");
                var link = document.createElement("a");
              
                //Append the li element to the id associated with the ul element.
                link.textContent = FacilityNames[i].FacilityName;
                link.href = linkNames[i].URL;
                // Appending the link to the tabledata and then appending the tabledata to the tablerow
                // The tablerow then gets appended to the tablebody
                // CampsiteList.appendChild(link);
                createTableRow.appendChild(tableData);
                tableBody.appendChild(createTableRow);
                tableData.appendChild(link);

                /* console.log(linkNames);
                 console.log(linkNames[i].URL); */
              
            }
  
        }
      });
  }
}

//third Search
function searchCampsite(facilityData) {
  for (var i = 0; i < facilityData.length; i++) {
    var facilityDataID = facilityData[i].FacilityID;
    var facilityDataUrl =
      "https://ridb.recreation.gov/api/v1/facilities/" +
      facilityDataID +
      "/campsites?apikey=064e9eb3-9b5a-4ba5-8127-32d6b2871560";
    fetch(facilityDataUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        createCampgroundHtml(data);
      });
  }
}
//Campground Data for website
function createCampgroundHtml(data) {
  console.log(data);
  //console.log(data.RECDATA[0].CampsiteName)
  //create Elements
}
// cityFormEl.addEventListener("submit", formSumbitHandler);
$("#city").keyup(function () {
  console.log($("#city").val());
  var cityInput = $("#city").val();
  //localStorage
  localStorage.setItem("city", cityInput);
});
$("#datepicker").change(function () {
  console.log($("#datepicker").val());
  var datepickerInput = $("#datepicker").val();
  //localStorage
  localStorage.setItem("datepicker", datepickerInput);
});

//Get the button:
mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
//gets current weather, for entered zip code, upon clicking the search button

// Logan Changes, Yikes, Sorry for the extra 300 lines, I couldn't get it to work with anything else
function currentInfo() {
  //retrieves value from city key in localStorage, uses value to run fetches
  var zipCode = localStorage.getItem("city");

  if (zipCode !== null) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?zip=" +
        zipCode +
        "&units=imperial&appid=0fe3cfd026afb76b1605f15581136ad8"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //variable for city name based on zip code search
        var cityName = data.name;
        var nameLabel = $("#weatherTitle");
        nameLabel.text(cityName);

        //   nameLabel.attr('class','bulma class');

        //$('selector').text(cityName);
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;
        //uses data from first api to call a second
        function forecastInfo() {
          fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
              latitude +
              "&lon=" +
              longitude +
              "&units=imperial&appid=0fe3cfd026afb76b1605f15581136ad8"
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              var current = data.current;
              var weather = data.current.weather;
              //current Weather
              var weatherDesc = weather[0].main;
              $("#currentDesc").text(weatherDesc);
              var weatherIcon = weather[0].icon;
              $("#weatherImg").attr(
                "src",
                "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
              );
              $("#weatherImg").attr("alt", "Weather Icon");
              var unixDate = current.dt;
              var currentDate = moment.unix(unixDate).format("MM/DD");
              $("#currentDate").text(currentDate);
              var temperature = current.temp;
              $("#currentTemp").text(Math.round(temperature) + "°F");
              var humidity = current.humidity;
              $("#currentHumidity").text("Humidity: " + humidity + "%");
              var windSpeed = current.wind_speed;
              $("#currentWindSpeed").text(
                "Wind Speed: " + Math.round(windSpeed) + "mph"
              );
              var uvIndex = current.uvi;
              $("#currentUV").text("UVI: " + uvIndex);
              //color One
              function uvColor() {
                currentUV = $(".uvIndex");
                if (uvIndex >= 0 && uvIndex < 3) {
                  currentUV.addClass("favorable");
                  currentUV.removeClass("severe");
                  currentUV.removeClass("moderate");
                } else if (uvIndex >= 3 && uvIndex < 6) {
                  currentUV.addClass("moderate");
                  currentUV.removeClass("severe");
                  currentUV.removeClass("favorable");
                } else if (uvIndex >= 6) {
                  currentUV.addClass("severe");
                  currentUV.removeClass("moderate");
                  currentUV.removeClass("favorable");
                }
              }
              uvColor();

              var daily = data.daily;

              //forecast two
              var dates = daily[1].dt;
              var forecastDates = moment.unix(dates).format("MM/DD");
              $("#dateTwo").text(forecastDates);
              var forecastIcon = daily[1].weather[0].icon;
              $("#imgTwo").attr(
                "src",
                "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
              );
              $("#imgTwo").attr("alt", "Weather Icon");
              var forecastDesc = daily[1].weather[0].main;
              $("#descTwo").text(forecastDesc);
              var forecastTemp = daily[1].temp.day;
              $("#tempTwo").text(Math.round(forecastTemp) + "°F");
              var forecastHumidity = daily[1].humidity;
              $("#humidityTwo").text("Humidity: " + forecastHumidity + "%");
              var forecastWind = daily[1].wind_speed;
              $("#windTwo").text(
                "Wind Speed: " + Math.round(forecastWind) + "mph"
              );
              var forecastUVTwo = daily[1].uvi;
              $("#uvTwo").text("UVI: " + forecastUVTwo);
              //color Two
              function uvColorTwo() {
                uvIndexTwo = $(".uvIndexTwo");
                if (forecastUVTwo >= 0 && forecastUVTwo < 3) {
                  uvIndexTwo.addClass("favorable");
                  uvIndexTwo.removeClass("severe");
                  uvIndexTwo.removeClass("moderate");
                } else if (forecastUVTwo >= 3 && forecastUVTwo < 6) {
                  uvIndexTwo.addClass("moderate");
                  uvIndexTwo.removeClass("severe");
                  uvIndexTwo.removeClass("favorable");
                } else if (forecastUVTwo >= 6) {
                  uvIndexTwo.addClass("severe");
                  uvIndexTwo.removeClass("moderate");
                  uvIndexTwo.removeClass("favorable");
                }
              }
              uvColorTwo();

              //forecast three
              var dates = daily[2].dt;
              var forecastDates = moment.unix(dates).format("MM/DD");
              $("#dateThree").text(forecastDates);
              var forecastIcon = daily[2].weather[0].icon;
              $("#imgThree").attr(
                "src",
                "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
              );
              $("#imgThree").attr("alt", "Weather Icon");
              var forecastDesc = daily[2].weather[0].main;
              $("#descThree").text(forecastDesc);
              var forecastTemp = daily[2].temp.day;
              $("#tempThree").text(Math.round(forecastTemp) + "°F");
              var forecastHumidity = daily[2].humidity;
              $("#humidityThree").text("Humidity: " + forecastHumidity + "%");
              var forecastWind = daily[2].wind_speed;
              $("#windThree").text(
                "Wind Speed: " + Math.round(forecastWind) + "mph"
              );
              var forecastUVThree = daily[2].uvi;
              $("#uvThree").text("UVI: " + forecastUVThree);
              //color three
              function uvColorThree() {
                uvIndexThree = $(".uvIndexThree");
                if (forecastUVThree >= 0 && forecastUVThree < 3) {
                  uvIndexThree.addClass("favorable");
                  uvIndexThree.removeClass("severe");
                  uvIndexThree.removeClass("moderate");
                } else if (forecastUVThree >= 3 && forecastUVThree < 6) {
                  uvIndexThree.addClass("moderate");
                  uvIndexThree.removeClass("severe");
                  uvIndexThree.removeClass("favorable");
                } else if (forecastUVThree >= 6) {
                  uvIndexThree.addClass("severe");
                  uvIndexThree.removeClass("moderate");
                  uvIndexThree.removeClass("favorable");
                }
              }
              uvColorThree();

              //forecast four
              var dates = daily[3].dt;
              var forecastDates = moment.unix(dates).format("MM/DD");
              $("#dateFour").text(forecastDates);
              var forecastIcon = daily[3].weather[0].icon;
              $("#imgFour").attr(
                "src",
                "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
              );
              $("#imgFour").attr("alt", "Weather Icon");
              var forecastDesc = daily[3].weather[0].main;
              $("#descFour").text(forecastDesc);
              var forecastTemp = daily[3].temp.day;
              $("#tempFour").text(Math.round(forecastTemp) + "°F");
              var forecastHumidity = daily[3].humidity;
              $("#humidityFour").text("Humidity: " + forecastHumidity + "%");
              var forecastWind = daily[3].wind_speed;
              $("#windFour").text(
                "Wind Speed: " + Math.round(forecastWind) + "mph"
              );
              var forecastUVFour = daily[3].uvi;
              $("#uvFour").text("UVI: " + forecastUVFour);
              //color four
              function uvColorFour() {
                uvIndexFour = $(".uvIndexFour");
                if (forecastUVFour >= 0 && forecastUVFour < 3) {
                  uvIndexFour.addClass("favorable");
                  uvIndexFour.removeClass("severe");
                  uvIndexFour.removeClass("moderate");
                } else if (forecastUVFour >= 3 && forecastUVFour < 6) {
                  uvIndexFour.addClass("moderate");
                  uvIndexFour.removeClass("severe");
                  uvIndexFour.removeClass("favorable");
                } else if (forecastUVFour >= 6) {
                  uvIndexFour.addClass("severe");
                  uvIndexFour.removeClass("moderate");
                  uvIndexFour.removeClass("favorable");
                }
              }
              uvColorFour();

              //forecast five
              var dates = daily[4].dt;
              var forecastDates = moment.unix(dates).format("MM/DD");
              $("#dateFive").text(forecastDates);
              var forecastIcon = daily[4].weather[0].icon;
              $("#imgFive").attr(
                "src",
                "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
              );
              $("#imgFive").attr("alt", "Weather Icon");
              var forecastDesc = daily[4].weather[0].main;
              $("#descFive").text(forecastDesc);
              var forecastTemp = daily[4].temp.day;
              $("#tempFive").text(Math.round(forecastTemp) + "°F");
              var forecastHumidity = daily[4].humidity;
              $("#humidityFive").text("Humidity: " + forecastHumidity + "%");
              var forecastWind = daily[4].wind_speed;
              $("#windFive").text(
                "Wind Speed: " + Math.round(forecastWind) + "mph"
              );
              var forecastUVFive = daily[4].uvi;
              $("#uvFive").text("UVI: " + forecastUVFive);
              //color five
              function uvColorFive() {
                uvIndexFive = $(".uvIndexFive");
                if (forecastUVFive >= 0 && forecastUVFive < 3) {
                  uvIndexFive.addClass("favorable");
                  uvIndexFive.removeClass("severe");
                  uvIndexFive.removeClass("moderate");
                } else if (forecastUVFive >= 3 && forecastUVFive < 6) {
                  uvIndexFive.addClass("moderate");
                  uvIndexFive.removeClass("severe");
                  uvIndexFive.removeClass("favorable");
                } else if (forecastUVFive >= 6) {
                  uvIndexFive.addClass("severe");
                  uvIndexFive.removeClass("moderate");
                  uvIndexFive.removeClass("favorable");
                }
              }
              uvColorFive();

              //forecast six
              var dates = daily[5].dt;
              var forecastDates = moment.unix(dates).format("MM/DD");
              $("#dateSix").text(forecastDates);
              var forecastIcon = daily[5].weather[0].icon;
              $("#imgSix").attr(
                "src",
                "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
              );
              $("#imgSix").attr("alt", "Weather Icon");
              var forecastDesc = daily[5].weather[0].main;
              $("#descSix").text(forecastDesc);
              var forecastTemp = daily[5].temp.day;
              $("#tempSix").text(Math.round(forecastTemp) + "°F");
              var forecastHumidity = daily[5].humidity;
              $("#humiditySix").text("Humidity: " + forecastHumidity + "%");
              var forecastWind = daily[5].wind_speed;
              $("#windSix").text(
                "Wind Speed: " + Math.round(forecastWind) + "mph"
              );
              var forecastUVSix = daily[5].uvi;
              $("#uvSix").text("UVI: " + forecastUVSix);

              //color six
              function uvColorSix() {
                uvIndexSix = $(".uvIndexSix");
                if (forecastUVSix >= 0 && forecastUVSix < 3) {
                  uvIndexSix.addClass("favorable");
                  uvIndexSix.removeClass("severe");
                  uvIndexSix.removeClass("moderate");
                } else if (forecastUVSix >= 3 && forecastUVSix < 6) {
                  uvIndexSix.addClass("moderate");
                  uvIndexSix.removeClass("severe");
                  uvIndexSix.removeClass("favorable");
                } else if (forecastUVSix >= 6) {
                  uvIndexSix.addClass("severe");
                  uvIndexSix.removeClass("moderate");
                  uvIndexSix.removeClass("favorable");
                }
              }
              uvColorSix();

              //forecast seven
              var dates = daily[6].dt;
              var forecastDates = moment.unix(dates).format("MM/DD");
              $("#dateSeven").text(forecastDates);
              var forecastIcon = daily[6].weather[0].icon;
              $("#imgSeven").attr(
                "src",
                "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
              );
              $("#imgSeven").attr("alt", "Weather Icon");
              var forecastDesc = daily[6].weather[0].main;
              $("#descSeven").text(forecastDesc);
              var forecastTemp = daily[6].temp.day;
              $("#tempSeven").text(Math.round(forecastTemp) + "°F");
              var forecastHumidity = daily[6].humidity;
              $("#humiditySeven").text("Humidity: " + forecastHumidity + "%");
              var forecastWind = daily[6].wind_speed;
              $("#windSeven").text(
                "Wind Speed: " + Math.round(forecastWind) + "mph"
              );
              var forecastUVSeven = daily[6].uvi;
              $("#uvSeven").text("UVI: " + forecastUVSeven);
              //color seven
              function uvColorSeven() {
                uvIndexSeven = $(".uvIndexSeven");
                if (forecastUVSeven >= 0 && forecastUVSeven < 3) {
                  uvIndexSeven.addClass("favorable");
                  uvIndexSeven.removeClass("severe");
                  uvIndexSeven.removeClass("moderate");
                } else if (forecastUVSeven >= 3 && forecastUVSeven < 6) {
                  uvIndexSeven.addClass("moderate");
                  uvIndexSeven.removeClass("severe");
                  uvIndexSeven.removeClass("favorable");
                } else if (forecastUVSeven >= 6) {
                  uvIndexSeven.addClass("severe");
                  uvIndexSeven.removeClass("moderate");
                  uvIndexSeven.removeClass("favorable");
                }
              }
              uvColorSeven();
            });
        }
        forecastInfo();
      });
  }
}

currentInfo();

//move window.location.href down here and added to a function, weather was not working since it would reload the page everytime the function ran
function secondPage() {
  window.location.href = "index2.html";
}
searchRecAreas(zipCode);
cityFormEl.addEventListener("submit", secondPage);
// cityFormEl.addEventListener('submit', formSubmitHandler);

// // Second Search -- Facility_Name
// function searchFacilities(recData) {
//   for (var i = 0; i < recData.length; i++) {
//       //Each Rec Area ID
//       var recAreaID = recData[i].RecAreaID;
//       var recAreaUrl = "https://ridb.recreation.gov/api/v1/recareas/" + recAreaID + "?full=true&apikey=064e9eb3-9b5a-4ba5-8127-32d6b2871560";
//       fetch(recAreaUrl)
//           .then(function(response) {
//               return response.json()
//           })
//           .then(function(data) {
//               if (data.FACILITY) {
//                   searchCampsite(data.FACILITY);
//                   var FacilityNames = data.FACILITY;
//                   //Facility Name
//                     for (var i = 0; i < FacilityNames.length; i++) {
//                       var listItem = document.createElement('li');
//                       listItem.textContent = FacilityNames[i].FacilityName;
//                //Append the li element to the id associated with the ul element(Facility Names).
//                      CampsiteList.appendChild(listItem);
//                   console.log(FacilityNames[i].FacilityName);
//                      }
//                    // Retreiving website URLS
//                   if (data.LINK) {
//                     searchCampsite(data.LINK);
//                   var linkNames = data.LINK;
//                   //Link Name
//                     for (var i = 0; i < linkNames.length; i++) {
//                       var listItem = document.createElement('li');
//                       var createTableRow = document.createElement('tr');
//                       var tableData = document.createElement('td');
//                       var link = document.createElement('a');
//                     //  listItem.textContent = linkNames[i].FacilityName;
//                       //CampsiteList.appendChild(listItem);
//                  //Append the li element to the id associated with the ul element.
//                  link.textContent = linkNames[i].URL;
//                  link.href = linkNames[i].URL;
//                  // Appending the link to the tabledata and then appending the tabledata to the tablerow
//                  // The tablerow then gets appended to the tablebody
//                  tableData.appendChild(link);
//                  createTableRow.appendChild(tableData);
//                  tableData.appendChild(createTableRow);
//                   console.log(linkNames);
//                   console.log(linkNames[i].URL);
//                     }
//                   }
//                   //Retrieving website Images
//                   if (data.MEDIA) {
//                   searchCampsite(data.MEDIA);
//                   var mediaNames = data.MEDIA;
//                   for (var i = 0; i < mediaNames.length; i++) {
//                       var webImage = document.createElement("img");
//                         webImage.src = mediaNames[i].URL;
//                         tableBody.append(webImage);
//                  console.log(mediaNames);
//                  console.log(mediaNames[0].URL);
//                   }
//              }
//               }
//           })
//   }
// }
