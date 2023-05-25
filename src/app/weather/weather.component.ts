import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  weatherData: any;

  constructor(private weatherService: WeatherService) {}
  
  ngOnInit(): void {
    this.weatherService
      .getCurrentLocation()
      .then((location: any) => {
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
  formatTemperature(temp: number) {
    //Methode pour qu'il n'y ait pas de chiffre après la virgule
    return temp.toFixed(0);
  }
  getFormattedDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }
}
