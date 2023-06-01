import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { HttpClient } from '@angular/common/http';
import { faWind } from '@fortawesome/free-solid-svg-icons';
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import * as Aos from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  imageUrl!: string;
  city!: string;
  faCompass = faCompass;
  faDrop = faDroplet;
  faArrowLeft = faArrowLeft;
  faThermometer = faThermometerHalf;
  faWind = faWind;
  weatherData: any;
  forecastData: any;
  isDayTime: boolean | undefined;

  constructor(private weatherService: WeatherService) {}
  ngOnInit() {
    Aos.init({ disable: 'mobile' });

    this.weatherService
      .getCurrentLocation() // methode pour demander la localisation de l'utilisateur
      .then((location: any) => {
        this.weatherService
          .getWeather(location.lat, location.lon)
          .subscribe((data) => {
            this.weatherData = data;
            this.isDayTime = data.isDaytime;
          });
      })
      .catch((error) => {
        console.log(error);
        // Handle error
      });
  }

  formatTemperature(temp: number) {
    //Methode pour qu'il n'y ait pas de chiffre après la virgule
    return temp.toFixed(0);
  }
  search() {
    this.weatherService
      .search(this.city)
      .subscribe(([currentWeatherData, forecastData]) => {
        this.weatherData = currentWeatherData;
        this.forecastData = forecastData;
      });
  }

  // updateImage(localTime: Date): void {
  //   const currentTime = localTime.getHours();
  //   const isDayTime = currentTime >= 6 && currentTime < 18;
  //   console.log(currentTime);
  //   if (isDayTime) {
  //     this.imageUrl = 'assets/luna.svg';
  //   } else {
  //     this.imageUrl = 'assets/soleil.svg';
  //   }
  // }
}
