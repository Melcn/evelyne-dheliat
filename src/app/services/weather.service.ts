import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiForcast = 'https://api.openweathermap.org/data/2.5/forecast';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = 'b97064688b9fd10fd57ce57df65e1add';
  constructor(private http: HttpClient) {}

  getWeather(lat: number, lon: number) {
    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return this.http.get(url).pipe(
      map((data: any) => {
        //Methode pour convertir kelin à celsius
        data.main.temp = data.main.temp - 273.15;
        return data;
      })
    );
  }
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  getWeatherForecast(lat: number, lon: number) {
    const url = `${this.apiForcast}?lat=${lat}&lon=${lon}&cnt=5&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }
}
