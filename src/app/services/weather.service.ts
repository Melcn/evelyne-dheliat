import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map } from 'rxjs';
import axios from 'axios';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiForcast = 'https://api.openweathermap.org/data/2.5/forecast';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = 'b97064688b9fd10fd57ce57df65e1add';

  public weatherDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
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
  private getSunriseSunset(lat: number, lon: number) {
    const sunriseSunsetUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
    return axios.get(sunriseSunsetUrl).then((response: any) => {
      console.log(response.data);
      return response.data;
    });
  }
  isDayTime(
    currentTime: number,
    sunriseTime: number,
    sunsetTime: number
  ): boolean {
    console.log('currentTime:', currentTime);
    console.log('sunriseTime:', sunriseTime);
    console.log('sunsetTime:', sunsetTime);
    if (currentTime >= sunriseTime && currentTime <= sunsetTime) {
      console.log('isDaytime: true');
      return true; // Il fait jour
    } else {
      console.log('isDaytime: false');
      return false; // Il fait nuit
    }
  }

  getWeatherForecast(lat: number, lon: number) {
    const url = `${this.apiForcast}?lat=${lat}&lon=${lon}&cnt=40&appid=${this.apiKey}&units=metric`; // Augmentez le cnt à 40 pour obtenir suffisamment de prévisions pour 5 jours
    return this.http.get(url).pipe(
      map((data: any) => {
        // Filtrer les prévisions pour obtenir une seule prévision par jour
        const dailyForecasts: any[] = [];
        const forecasts = data.list;
        let currentDate = new Date(forecasts[0].dt_txt).getDate();

        forecasts.forEach((forecast: any) => {
          const forecastDate = new Date(forecast.dt_txt).getDate();
          if (forecastDate !== currentDate) {
            dailyForecasts.push(forecast);
            currentDate = forecastDate;
          }
        });

        // Retourner les prévisions filtrées
        data.list = dailyForecasts;
        return data;
      })
    );
  }
  search(city: string): Observable<any> {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const currentWeather$ = this.http.get<any>(currentWeatherUrl);
    const forecast$ = this.http.get<any>(forecastUrl);

    return forkJoin([currentWeather$, forecast$]);
  }
}
