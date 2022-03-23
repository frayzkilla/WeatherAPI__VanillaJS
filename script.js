var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


function success(pos) {

    var crd = pos.coords;
    console.log(pos.coords)
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    const cityCode = '2023469';
    //const requestURL = 'http://api.openweathermap.org/data/2.5/forecast?id='+cityCode+'&appid=30fa49e0faa049ae7d4a8c33a2805cfb';
    const coordsURL = 'http://api.openweathermap.org/geo/1.0/direct?q=Сочи&appid=30fa49e0faa049ae7d4a8c33a2805cfb'
    const requestURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude={part}&appid=30fa49e0faa049ae7d4a8c33a2805cfb';

    const xhr_name = new XMLHttpRequest();
    xhr_name.open('GET', requestURL);
    xhr_name.responseType = 'json';


    xhr_name.onload = () => {

        console.log(xhr_name.response);
        const xhr_id = new XMLHttpRequest();
        let city = xhr_name.response.timezone;
        city = city.split('/')[1];
        const idURL = 'http://api.geonames.org/searchJSON?q='+ city +'&maxRows=1&username=frayz';
        xhr_id.open('GET', idURL);
        xhr_id.responseType = 'json';


        xhr_id.onload = () => {
            console.log(xhr_id.response.geonames[0].geonameId);
            city_id = xhr_id.response.geonames[0].geonameId;

            const finalURL = 'http://api.openweathermap.org/data/2.5/forecast?id='+city_id+'&appid=30fa49e0faa049ae7d4a8c33a2805cfb';

            const xhr = new XMLHttpRequest();
            xhr.open('GET', finalURL);
            xhr.responseType = 'json';


            xhr.onload = () => {

                console.log(xhr.response);
                document.getElementById('maincity').innerHTML = xhr.response.city.name;
                document.getElementById('maintemp').innerHTML = Math.round(xhr_name.response.current.temp - 273.15);
                document.getElementById('maindesc').innerHTML = xhr_name.response.current.weather[0].main;
                let icon_URL =  'http://openweathermap.org/img/wn/'+xhr_name.response.current.weather[0].icon+'@2x.png';
                icon_URL = "url('"+icon_URL+"')";
                console.log(icon_URL);
                document.getElementById('icon1').style.backgroundImage = icon_URL;

                let nowHour = new Date().toLocaleTimeString().slice(0,2);
                
                let nextHour = 0;
                let nextHourIndex;

                for (i = 0; i<14; i++){
                    //console.log(xhr.response.list[i].dt_txt.slice(11,13));
                    if (parseInt(xhr.response.list[i].dt_txt.slice(11,13))>nowHour && parseInt(xhr.response.list[i].dt_txt.slice(11,13))-nowHour<=3){
                        nextHour = parseInt(xhr.response.list[i].dt_txt.slice(11,13));
                        console.log(nextHour);
                        nextHourIndex = i;
                        break;
                    }
                    else if(parseInt(xhr.response.list[i].dt_txt.slice(11,13))==0 && 24 - nowHour < 3){
                        nextHourIndex = i;
                    }
                }

                //nextHourIndex = nextHour - nowHour;

                //console.log('nextHourIndex = '+nextHourIndex);

                nextHour = parseInt(nowHour) + 2;
                nextHourIndex = 1;

                document.getElementById('temp1').innerHTML = Math.round(xhr_name.response.current.temp - 273.15);;
                
                /* document.getElementById('time2').innerHTML = xhr.response.list[nextHourIndex].dt_txt.slice(11,13);
                document.getElementById('temp2').innerHTML = Math.round(xhr.response.list[nextHourIndex].main.temp - 273.15);
                icon_URL =  'http://openweathermap.org/img/wn/'+xhr.response.list[nextHourIndex].weather[0].icon+'@2x.png'; */

                document.getElementById('time2').innerHTML = nextHour;
                document.getElementById('temp2').innerHTML = Math.round(xhr_name.response.hourly[nextHourIndex].temp - 273.15);
                icon_URL =  'http://openweathermap.org/img/wn/'+xhr_name.response.hourly[nextHourIndex].weather[0].icon+'@2x.png';
                icon_URL = "url('"+icon_URL+"')";
                document.getElementById('icon2').style.backgroundImage = icon_URL;
                nextHourIndex += 3;
                

                document.getElementById('time3').innerHTML = (nextHour + 3) % 24;
                document.getElementById('temp3').innerHTML = Math.round(xhr_name.response.hourly[nextHourIndex].temp - 273.15);
                icon_URL =  'http://openweathermap.org/img/wn/'+xhr_name.response.hourly[nextHourIndex].weather[0].icon+'@2x.png';
                icon_URL = "url('"+icon_URL+"')";
                document.getElementById('icon3').style.backgroundImage = icon_URL;
                nextHourIndex += 3;

                document.getElementById('time4').innerHTML = (nextHour + 6) % 24;
                document.getElementById('temp4').innerHTML = Math.round(xhr_name.response.hourly[nextHourIndex].temp - 273.15);
                icon_URL =  'http://openweathermap.org/img/wn/'+xhr_name.response.hourly[nextHourIndex].weather[0].icon+'@2x.png';
                icon_URL = "url('"+icon_URL+"')";
                document.getElementById('icon4').style.backgroundImage = icon_URL;
                nextHourIndex += 3;

                document.getElementById('time5').innerHTML = (nextHour + 9) % 24;
                document.getElementById('temp5').innerHTML = Math.round(xhr_name.response.hourly[nextHourIndex].temp - 273.15);
                icon_URL =  'http://openweathermap.org/img/wn/'+xhr_name.response.hourly[nextHourIndex].weather[0].icon+'@2x.png';
                icon_URL = "url('"+icon_URL+"')";
                document.getElementById('icon5').style.backgroundImage = icon_URL;
                nextHourIndex += 3;

                document.getElementById('feels_like').innerHTML = Math.round(xhr_name.response.current.feels_like - 273.15);
                document.getElementById('pressure').innerHTML = Math.round(xhr_name.response.current.pressure / 1.333);
                document.getElementById('humidity').innerHTML = Math.round(xhr_name.response.current.humidity) + '%';
                document.getElementById('wind').innerHTML = Math.round(xhr_name.response.current.wind_speed) + ' м/с';


                if(xhr_name.response.current.weather[0].icon.slice(-1) == 'n'){
                    document.getElementById('mainwrap').classList.remove('day');
                    document.getElementById('mainwrap').classList.add('night');
                } else {
                    document.getElementById('mainwrap').classList.remove('night');
                    document.getElementById('mainwrap').classList.add('day');
                }
            }

            xhr.send();
        }

        xhr_id.send();
    }


    function sendXHR() {
        xhr_name.send(); 
    }


    sendXHR();

};
  
function error(err) {
    console.log('AAAAAAA');
};


navigator.geolocation.getCurrentPosition(success, error, options);



