import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  maker: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2040)
  year: number;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  long: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
