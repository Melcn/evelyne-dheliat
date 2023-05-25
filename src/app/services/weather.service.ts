import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

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
}



