import { IsString } from 'class-validator';

export class DeleteTodoDto {
  @IsString()
  todoId: string;
}

