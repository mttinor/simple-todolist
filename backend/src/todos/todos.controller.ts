import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ToggleTodoDto } from './dto/toggle-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    return this.todosService.create(createTodoDto, req.user.id);
  }

  @Get('for-date')
  getTodosForDate(@Query('date') date: string, @Request() req) {
    const dateNumber = parseInt(date, 10);
    return this.todosService.getTodosForDate(dateNumber, req.user.id);
  }

  @Post('toggle')
  toggleTodo(@Body() toggleTodoDto: ToggleTodoDto, @Request() req) {
    return this.todosService.toggleTodo(toggleTodoDto, req.user.id);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string, @Request() req) {
    return this.todosService.deleteTodo(id, req.user.id);
  }
}

