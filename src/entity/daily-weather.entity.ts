import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique([
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
])
export class DailyWeatherEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ select: false })
  dt: number;

  @Column('double precision', { select: false })
  lat: number;

  @Column('double precision', { select: false })
  lon: number;

  @Column()
  sunrise: number;

  @Column()
  sunset: number;

  @Column('simple-json')
  temp: object;

  @Column('simple-json')
  feels_like: object;

  @Column()
  pressure: number;

  @Column()
  humidity: number;

  @Column('double precision')
  uvi: number;

  @Column('double precision')
  wind_speed: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
