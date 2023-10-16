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
  'temp',
  'feels_like',
  'pressure',
  'humidity',
  'uvi',
  'wind_speed',
])
export class HourlyWeatherEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ select: false })
  dt: number;

  @Column('double precision', { select: false })
  lat: number;

  @Column('double precision', { select: false })
  lon: number;

  @Column('double precision')
  temp: number;

  @Column('double precision')
  feels_like: number;

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
