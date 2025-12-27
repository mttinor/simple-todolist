import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { User } from './entities/user.entity';
import { Todo } from './entities/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'todo.db',
      entities: [User, Todo],
      synchronize: true, // Set to false in production
      logging: false,
    }),
    AuthModule,
    TodosModule,
  ],
})
export class AppModule {}

