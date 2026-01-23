import { 
  IsEmail, 
  IsString, 
  IsOptional, 
  IsNotEmpty, 
  MinLength, 
  MaxLength,
  IsIn
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must be less than 255 characters' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(1, { message: 'Password cannot be empty' })
  password!: string;

  @IsOptional()
  @IsString()
  @IsIn(['student', 'teacher', 'admin'], { 
    message: 'Role must be one of: student, teacher, or admin' 
  })
  role?: 'student' | 'teacher' | 'admin';
}
