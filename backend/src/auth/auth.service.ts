import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password, flow } = signInDto;

    // Anonymous sign in
    if (!email && !password) {
      const anonymousUser = this.userRepository.create({
        email: null,
        password: null,
        isAnonymous: true,
      });
      const savedUser = await this.userRepository.save(anonymousUser);
      return {
        access_token: this.jwtService.sign({
          sub: savedUser.id,
          email: savedUser.email,
          isAnonymous: true,
        }),
        user: {
          id: savedUser.id,
          email: savedUser.email,
          isAnonymous: true,
        },
      };
    }

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (flow === 'signUp') {
      if (user) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
        isAnonymous: false,
      });
      const savedUser = await this.userRepository.save(newUser);

      return {
        access_token: this.jwtService.sign({
          sub: savedUser.id,
          email: savedUser.email,
          isAnonymous: false,
        }),
        user: {
          id: savedUser.id,
          email: savedUser.email,
          isAnonymous: false,
        },
      };
    } else {
      // signIn flow
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      return {
        access_token: this.jwtService.sign({
          sub: user.id,
          email: user.email,
          isAnonymous: false,
        }),
        user: {
          id: user.id,
          email: user.email,
          isAnonymous: false,
        },
      };
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user || null;
  }
}

