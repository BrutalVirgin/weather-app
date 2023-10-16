import * as dotenv from 'dotenv';
dotenv.config();

import { Injectable } from '@nestjs/common';
import { GetWeatherDto, PostWeatherDto } from './dto/weather.dto';
import axios from 'axios';
import { CurrentWeatherEntity } from './entity/current-weather.entity';
import { HourlyWeatherEntity } from './entity/hourly-weather.entity';
import { DailyWeatherEntity } from './entity/daily-weather.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CurrentWeatherEntity)
    private readonly currentWeatherRepository: Repository<CurrentWeatherEntity>,
    @InjectRepository(HourlyWeatherEntity)
    private readonly hourlyWeatherRepository: Repository<HourlyWeatherEntity>,
    @InjectRepository(DailyWeatherEntity)
    private readonly dailyWeatherRepository: Repository<DailyWeatherEntity>,
  ) {}

  async saveWeatherData(data: PostWeatherDto) {
    const { lat, lon, part } = data;

    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${process.env.WEATHER_API_KEY}`,
    );

    await this.saveCurrentWeather(weatherData.data?.current, lat, lon);

    if (weatherData.data?.hourly && weatherData.data?.hourly.length > 0) {
      await this.saveHourlyWeather(weatherData.data.hourly, lat, lon);
    }

    if (weatherData.data?.daily && weatherData.data?.daily.length > 0) {
      await this.saveDailyWeather(weatherData.data.daily, lat, lon);
    }

    return weatherData.data;
  }

  async saveCurrentWeather(data: any, lat: number, lon: number) {
    await this.currentWeatherRepository.upsert(
      {
        lat,
        lon,
        dt: data.dt,
        sunrise: data.sunrise,
        sunset: data.sunset,
        temp: data.temp,
        feels_like: data.feels_like,
        pressure: data.pressure,
        humidity: data.humidity,
        uvi: data.uvi,
        wind_speed: data.wind_speed,
      },
      [
        'dt',
        'lat',
        'lon',
        'sunrise',
        'sunset',
        'temp',
        'feels_like',
        'pressure',
        'humidity',
        'uvi',
        'wind_speed',
      ],
    );
  }

  async saveHourlyWeather(data: any, lat: number, lon: number) {
    await this.checkOrDeleteData(this.hourlyWeatherRepository, lat, lon);

    const rawData = data.map((item) => ({
      lat,
      lon,
      dt: item.dt,
      temp: item.temp,
      feels_like: item.feels_like,
      pressure: item.pressure,
      humidity: item.humidity,
      uvi: item.uvi,
      wind_speed: item.wind_speed,
    }));

    await this.hourlyWeatherRepository.upsert(rawData, [
      'dt',
      'lat',
      'lon',
      'temp',
      'feels_like',
      'pressure',
      'humidity',
      'uvi',
      'wind_speed',
    ]);
  }

  async saveDailyWeather(data: any, lat: number, lon: number) {
    await this.checkOrDeleteData(this.dailyWeatherRepository, lat, lon);

    const rawData = data.map((item) => ({
      lat,
      lon,
      dt: item.dt,
      sunrise: item.sunrise,
      sunset: item.sunset,
      temp: item.temp,
      feels_like: item.feels_like,
      pressure: item.pressure,
      humidity: item.humidity,
      uvi: item.uvi,
      wind_speed: item.wind_speed,
    }));

    await this.dailyWeatherRepository.upsert(rawData, [
      'dt',
      'lat',
      'lon',
      'sunrise',
      'sunset',
      'temp',
      'feels_like',
      'pressure',
      'humidity',
      'uvi',
      'wind_speed',
    ]);
  }

  async checkOrDeleteData(repository: any, lat: number, lon: number) {
    const isWeatherExists = await repository.findOne({
      where: { lat, lon },
      select: { createdAt: true },
    });

    const startDayDate = moment().startOf('day');

    if (moment(isWeatherExists.createdAt).isSameOrBefore(startDayDate)) {
      await repository.delete({
        lat,
        lon,
      });
    }
  }

  async getWeatherData(data: GetWeatherDto) {
    const { lat, lon } = data;
    const whereStatement = {
      lat,
      lon,
    };

    const currentWeather = await this.currentWeatherRepository.findOne({
      where: whereStatement,
      order: { createdAt: 'desc' },
    });

    const hourlyWeather = await this.hourlyWeatherRepository.find({
      where: whereStatement,
    });

    const dailyWeather = await this.dailyWeatherRepository.find({
      where: whereStatement,
    });

    return {
      currentWeather,
      hourlyWeather,
      dailyWeather,
    };
  }
}
