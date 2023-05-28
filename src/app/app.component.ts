import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  weatherData: any;
  constructor(private weatherService: WeatherService) {}
  ngOnInit() {
    this.weatherService
      .getCurrentLocation() // methode pour demander la localisation de l'utilisateur
      .then((location: any) => {
        this.weatherService
          .getWeather(location.lat, location.lon)
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
}
