import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ToggleTodoDto } from './dto/toggle-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  private transformTodo(todo: Todo): any {
    return {
      ...todo,
      recurringDays: todo.recurringDays ? JSON.parse(todo.recurringDays) : null,
      completedDates: todo.completedDates ? JSON.parse(todo.completedDates) : [],
    };
  }

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<any> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId,
      recurringDays: createTodoDto.recurringDays
        ? JSON.stringify(createTodoDto.recurringDays)
        : null,
      completedDates: JSON.stringify([]),
    });

    const savedTodo = await this.todoRepository.save(todo);
    return this.transformTodo(savedTodo);
  }

  async getTodosForDate(date: number, userId: string): Promise<any[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const targetDay = targetDate.getDay();
    const targetTimestamp = targetDate.getTime();

    const allTodos = await this.todoRepository.find({
      where: { userId },
    });

    return allTodos.filter((todo) => {
      // Non-recurring todos
      if (!todo.isRecurring) {
        if (todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === targetTimestamp;
        }
        return true; // Show todos without due date
      }

      // Recurring todos
      if (todo.recurringType === 'daily') {
        return true; // Daily recurring todos appear every day
      }

      if (todo.recurringType === 'weekly') {
        const recurringDays: number[] = todo.recurringDays
          ? JSON.parse(todo.recurringDays)
          : [];
        return recurringDays.includes(targetDay);
      }

      return false;
    }).map(todo => this.transformTodo(todo));
  }

  async toggleTodo(toggleTodoDto: ToggleTodoDto, userId: string): Promise<any> {
    const todo = await this.todoRepository.findOne({
      where: { id: toggleTodoDto.todoId },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this todo');
    }

    if (todo.isRecurring && toggleTodoDto.date) {
      // For recurring todos, track completion by date
      const completedDates: number[] = todo.completedDates
        ? JSON.parse(todo.completedDates)
        : [];

      const dateKey = new Date(toggleTodoDto.date).setHours(0, 0, 0, 0);

      const index = completedDates.indexOf(dateKey);
      if (index > -1) {
        completedDates.splice(index, 1);
      } else {
        completedDates.push(dateKey);
      }

      todo.completedDates = JSON.stringify(completedDates);
    } else {
      // For non-recurring todos, toggle the completed flag
      todo.completed = !todo.completed;
    }

    const savedTodo = await this.todoRepository.save(todo);
    return this.transformTodo(savedTodo);
  }

  async deleteTodo(todoId: string, userId: string): Promise<void> {
    const todo = await this.todoRepository.findOne({
      where: { id: todoId },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this todo');
    }

    await this.todoRepository.remove(todo);
  }
}

