import { IsEmail, IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@uce\.edu\.ec$/, {
    message: 'El email debe ser del dominio @uce.edu.ec'
  })
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'La cédula debe tener 10 dígitos'
  })
  identification?: string;

  @IsOptional()
  @IsString()
  faculty?: string;

  @IsOptional()
  @IsString()
  career?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}