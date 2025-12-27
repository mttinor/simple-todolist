import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'bigint', nullable: true })
  dueDate: number | null;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ type: 'varchar', nullable: true })
  recurringType: 'weekly' | 'daily' | null;

  @Column({ type: 'text', nullable: true })
  recurringDays: string | null; // JSON array of day numbers [0,1,2,3,4,5,6]

  @Column({ type: 'text', nullable: true })
  completedDates: string | null; // JSON array of timestamps

  @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

