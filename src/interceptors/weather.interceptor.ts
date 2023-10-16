import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  transformWeatherData(weatherData: any) {
    return {
      sunrise: weatherData.sunrise,
      sunset: weatherData.sunset,
      temp: weatherData.temp,
      feels_like: weatherData.feels_like,
      pressure: weatherData.pressure,
      humidity: weatherData.humidity,
      uvi: weatherData.uvi,
      wind_speed: weatherData.wind_speed,
    };
  }

  transformWeatherArray(weatherArray: any[]) {
    return weatherArray.map((item) => this.transformWeatherData(item));
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data.currentWeather) {
          data.currentWeather = this.transformWeatherData(data.currentWeather);
        }

        if (data.hourlyWeather) {
          data.hourlyWeather = this.transformWeatherArray(data.hourlyWeather);
        }

        if (data.dailyWeather) {
          data.dailyWeather = this.transformWeatherArray(data.dailyWeather);
        }

        return data;
      }),
    );
  }
}
