import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPasswordStepTwoDto } from './dto/forgot-password-step-two.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    return this.usersRepository.save(createUserDto);
  }

  async updateMe(updateUserDto: UpdateUserDto, userId: number) {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async remove(userId: number) {
    return this.usersRepository.delete({ id: userId });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email: email });
  }

  findById(id: number) {
    return this.usersRepository.findOneBy({ id: id });
  }

  async forgotPassword(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    user.forgotPasswordToken = uuidv4();
    await this.usersRepository.save(user);
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Forgot Password',
      html: `<b>Click <a href="http://localhost:5173/${user.forgotPasswordToken}">here</a> to reset your password</b>`,
    });
    return;
  }

  async forgotPasswordStepTwo(dto: ForgotPasswordStepTwoDto) {
    const user = await this.usersRepository.findOneBy({
      forgotPasswordToken: dto.token,
    });
    if (!user) {
      throw new Error('Invalid token');
    }
    user.password = dto.password;
    user.forgotPasswordToken = null;
    await this.usersRepository.save(user);
  }
}
