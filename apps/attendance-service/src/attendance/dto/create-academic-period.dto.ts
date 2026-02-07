import { IsString, IsNotEmpty, Length, IsDate, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateAcademicPeriodDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;

}