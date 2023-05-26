import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  city!: string;
  weatherData: any;
  weatherForm!: FormGroup;
  constructor(private weatherService: WeatherService) {}
  ngOnInit() {
    this.weatherService
      .getCurrentLocation() // methode pour demander la localisation de l'utilisateur
      .then((location: any) => {
        this.weatherService
          .getWeather(location.lat, location.lon, this.city)
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

  onSubmit() {
    const city = this.weatherForm.value.city;
    if (city) {
      this.weatherService.getWeatherForecast(city).subscribe(
        (data: any) => {
          this.weatherData = data;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  
}
