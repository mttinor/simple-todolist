import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ToggleTodoDto {
  @IsString()
  todoId: string;

  @IsNumber()
  @IsOptional()
  date?: number;
}

