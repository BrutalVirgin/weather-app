import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GetWeatherDto, PostWeatherDto } from './dto/weather.dto';
import { TransformationInterceptor } from './interceptors/weather.interceptor';

@Controller('weather')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async saveData(@Response() res: any, @Body() data: PostWeatherDto) {
    return res
      .status(HttpStatus.OK)
      .json(await this.appService.saveWeatherData(data));
  }

  @Get()
  @UseInterceptors(TransformationInterceptor)
  async getWeatherData(@Body() data: GetWeatherDto) {
    return await this.appService.getWeatherData(data);
  }
}
