import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherData } from './models/weather.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private weatherService: WeatherService) {}
  cityName!: string;
  WeatherData!: WeatherData;
  ngOnInit(): void {
    this.weatherService.getWeatherData('Landon').subscribe({
      next: (Response) => {
        this.WeatherData = Response;
        console.log(Response);
      },
    });
  }
  onSubmit() {}
}
