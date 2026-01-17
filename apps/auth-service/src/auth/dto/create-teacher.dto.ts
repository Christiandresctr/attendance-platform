import { 
  IsEmail, 
  IsString, 
  IsOptional, 
  IsBoolean, 
  Matches, 
  MinLength, 
  MaxLength,
  IsNotEmpty
} from 'class-validator';

export class CreateTeacherDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Matches(/^[a-zA-Z0-9._%+-]+@uce\.edu\.ec$/, {
    message: 'Email must be a valid UCE institutional email (@uce.edu.ec)'
  })
  @MaxLength(255, { message: 'Email must be less than 255 characters' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must be less than 100 characters' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'Name can only contain letters, spaces, and Spanish accents'
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Teacher ID is required' })
  @MinLength(3, { message: 'Teacher ID must be at least 3 characters long' })
  @MaxLength(20, { message: 'Teacher ID must be less than 20 characters' })
  teacherId: string;

  @IsString()
  @IsNotEmpty({ message: 'Identification is required' })
  @Matches(/^\d{10}$/, {
    message: 'Identification must contain exactly 10 digits'
  })
  identification: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Faculty must be at least 2 characters long' })
  @MaxLength(100, { message: 'Faculty must be less than 100 characters' })
  faculty?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Department must be at least 2 characters long' })
  @MaxLength(100, { message: 'Department must be less than 100 characters' })
  department?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}