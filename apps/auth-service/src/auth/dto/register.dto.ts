import { 
  IsEmail, 
  IsString, 
  IsOptional, 
  IsArray, 
  MinLength, 
  MaxLength, 
  Matches,
  IsNotEmpty,
  IsAlphanumeric
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must be less than 255 characters' })
  @Matches(/^[a-zA-Z0-9._%+-]+@uce\.edu\.ec$/, { 
    message: 'Email must be a valid UCE institutional email (@uce.edu.ec)' 
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must be less than 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
  })
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty when provided' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must be less than 100 characters' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'Name can only contain letters, spaces, and Spanish accents'
  })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Identification must be exactly 10 digits' })
  @MaxLength(10, { message: 'Identification must be exactly 10 digits' })
  @Matches(/^\d{10}$/, {
    message: 'Identification must contain exactly 10 digits'
  })
  identification?: string;

  @IsOptional()
  @IsArray()
  roles?: string[];
}
