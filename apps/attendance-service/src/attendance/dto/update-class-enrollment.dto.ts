import { PartialType } from '@nestjs/mapped-types';  
import { CreateClassEnrollmentDto } from './create-class-enrollment.dto';

export class UpdateClassEnrollmentDto extends PartialType(CreateClassEnrollmentDto) {}