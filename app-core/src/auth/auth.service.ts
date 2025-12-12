import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    user: { id: string; name: string; email: string; role: string };
    token: string;
  }> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: registerDto.email },
        { username: registerDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException('El usuario o email ya existe');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create new user
    const newUser = this.usersRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      role: 'user',
    });

    await this.usersRepository.save(newUser);

    return {
      user: {
        id: newUser.id,
        name: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token: `token-${newUser.id}`, // TODO: usar JWT real
    };
  }

  async login(loginDto: LoginDto): Promise<{
    user: { id: string; name: string; email: string; role: string };
    token: string;
  }> {
    // Find user by email
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
      token: `token-${user.id}`, // TODO: usar JWT real
    };
  }
}
