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
           
            const isDaytime = data.isDaytime;

            // Afficher l'icône correspondante en fonction de isDaytime
            if (typeof isDaytime !== 'undefined') {
              if (isDaytime) {
                // Afficher l'icône du soleil
                console.log('Afficher icône du soleil');
              } else {
                // Afficher l'icône de la lune
                console.log('Afficher icône de la lune');
              }
            } else {
              console.log('isDaytime n\'est pas défini');
            }
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