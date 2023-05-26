import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, catchError, map, mergeMap, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class WeatherService {
  private apiForcast = 'https://api.openweathermap.org/data/2.5/forecast';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = 'b97064688b9fd10fd57ce57df65e1add';

  public weatherDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {}

  getWeather(lat: number, lon: number) {
    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return this.http.get(url).pipe(
      mergeMap((data: any) => {
        return this.getSunriseSunset(lat, lon).then((sunriseSunsetData: any) => {
          const sunriseTime = new Date(sunriseSunsetData.results.sunrise).getTime();
          const sunsetTime = new Date(sunriseSunsetData.results.sunset).getTime();
          const currentTime = Date.now();

          data.isDaytime = this.isDaytime(currentTime, sunriseTime, sunsetTime);
          return data;
        });
      }),
      map((data: any) => {
        // Convertir de Kelvin à Celsius
        data.main.temp = data.main.temp - 273.15;
        return data;
      }),
      catchError((error: any) => {
        console.error('Error occurred while fetching weather data:', error);
        return ('An error occurred while fetching weather data.');
      })
    );
  }

  private getSunriseSunset(lat: number, lon: number) {
    const sunriseSunsetUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
    return axios.get(sunriseSunsetUrl).then((response: any) => response.data);
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

  isDaytime(currentTime: number, sunriseTime: number, sunsetTime: number): boolean {
    return currentTime >= sunriseTime && currentTime <= sunsetTime;
  }
}


