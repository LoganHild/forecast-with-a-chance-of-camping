$("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true
}
);

//gets current weather, for entered zip code, upon clicking the search button
var searchBtn = $('.button');
var zipCode = $('#zip');

searchBtn.on('click', function currentInfo(event) {
    event.preventDefault();

    if (zipCode.val() !== null) {
        fetch('https://api.openweathermap.org/data/2.5/weather?zip=' + zipCode.val() + '&units=imperial&appid=0fe3cfd026afb76b1605f15581136ad8')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            //variable for city name based on zip code search
            var cityName = data.name;
            //$('selector').text(cityName);

            var latitude = data.coord.lat;
            var longitude = data.coord.lon;

            //uses data from first api to call a second
            function forecastInfo() {
                fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=0fe3cfd026afb76b1605f15581136ad8')
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        console.log(data);
                        
                        //Weather description
                        var weatherDesc = data.current.weather[0].main;

                        //Weather Icon
                        var weatherIcon = data.current.weather[0].weatherIcon;
                        //$('selector').attr('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png');
                        //$('selector').attr('alt', 'Weather Icon');

                        //Date
                        var unixDate = data.current.dt;
                        var currentDate = moment.unix(unixDate).format('MM/DD/YYYY');
                        //$('selector').text(currentDate)

                        //Temperature
                        var temperature = data.current.temp;
                        //$('selector).text('Temperature: ' + Math.round(temperature) + '°F');

                        //Humidity
                        var humidity = data.current.humidity;
                        //$('selector').text('Humidity: ' + humidity + '%')

                        //Wind Speed
                        var windSpeed = data.current.wind_speed;
                        //$('selector').text('Wind Speed: ' + windValue + 'mph');

                        //UV index
                        var uvIndex = data.current.uvi;
                        // $('selector').text('UV Index: ' + uvIndex);

                    })
                }
            forecastInfo();
        })
    }
})