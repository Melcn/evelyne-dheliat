import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { faWind } from '@fortawesome/free-solid-svg-icons';
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  faDrop = faDroplet;
  faArrowLeft = faArrowLeft;
  faThermometer = faThermometerHalf;
  faWind = faWind;
  weatherData: any;
  isDayTime: boolean | undefined;


  constructor(private weatherService: WeatherService) {}
  
   ngOnInit(): void {
 this.weatherService
 .getCurrentLocation()
 .then((location: any) => {
 this.weatherService
 .getWeather(location.lat, location.lon)
 .subscribe((data) => {
 this.isDayTime = data.isDayTime;
 });
 
 this.weatherService
 .getWeatherForecast(location.lat, location.lon)
 .subscribe((data) => {
 this.weatherData = data;
 });
 })
 .catch((error) => {
 console.log(error);
 // Handle error
 });
 }


  ngOnInit(): void {
    this.weatherService
      .getCurrentLocation()
      .then((location: any) => {
        this.weatherService
          .getWeatherForecast(location.lat, location.lon)
          .subscribe((data) => {
            this.weatherData = data;
          });
        this.weatherService
          .getWeatherForecast(location.lat, location.lon)
          .subscribe((data) => {
            this.weatherData = data;
          });
      })
      .catch((error) => {
        console.log(error);
        // Handle error
      });
  }
=======

  formatTemperature(temp: number) {
    //Methode pour qu'il n'y ait pas de chiffre après la virgule
    return temp.toFixed(0);
  }
  getFormattedDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('fr-FR', options);
  }
}