import { Role } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsString()
    userName: string;
  
    @IsString()
    password: string;
  
    @IsOptional()
    @IsEnum(['USER', 'ADMIN'], { message: 'Role must be USER or ADMIN' })
    role?: Role;
  }