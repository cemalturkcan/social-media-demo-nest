import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersMapper } from './users.mapper';
import { Public } from '../auth/publicDecorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Request, Response } from 'express';
import { ForgotPasswordStepTwoDto } from './dto/forgot-password-step-two.dto';
import { getAuthenticatedUserId } from '../util/RequestUtil';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersMapper: UsersMapper,
  ) {}

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersMapper.mapUserToUserResponse(
      await this.usersService.create(createUserDto),
    );
  }

  @Put()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.usersMapper.mapUserToUserResponse(
      await this.usersService.updateMe(
        updateUserDto,
        getAuthenticatedUserId(req),
      ),
    );
  }

  @Delete()
  deleteAccount(@Req() req: Request) {
    return this.usersService.remove(getAuthenticatedUserId(req));
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(
    @Res() res: Response,
    @Body() { email }: ForgotPasswordDto,
  ) {
    await this.usersService.forgotPassword(email);
    return res.status(HttpStatus.OK).send();
  }

  @Post('forgot-password-step-two')
  @Public()
  async forgotPasswordStepTwo(
    @Res() res: Response,
    @Body() dto: ForgotPasswordStepTwoDto,
  ) {
    await this.usersService.forgotPasswordStepTwo(dto);
    return res.status(HttpStatus.OK).send();
  }
}
