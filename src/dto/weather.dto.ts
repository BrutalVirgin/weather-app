import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class GetWeatherDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  lon: number;
}

export class PostWeatherDto extends GetWeatherDto {
  @IsString()
  @IsNotEmpty()
  part: string;
}
