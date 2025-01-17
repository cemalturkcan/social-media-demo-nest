import { Body, Controller, Post, Res } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { Public } from '../auth/publicDecorator';
import { Response } from 'express';
import { TranslateRequestDto } from './dto/translate-request.dto';

@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post()
  @Public()
  async forgotPasswordStepTwo(
    @Res() res: Response,
    @Body() dto: TranslateRequestDto,
  ) {
    const translation = await this.translateService.translate(dto.text);
    return res.status(200).send({
      translation: translation,
    });
  }
}
