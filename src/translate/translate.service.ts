import { Injectable } from '@nestjs/common';
import { getOllamaTranslation } from '../outsourceapi/api/Ollama';
import { Inject } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TranslateService {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
  ) {}

  prompt =
    "You are a professional translator. Your task is to translate the given text accurately while preserving its meaning. Do not provide any explanations or additional information. Only return the direct translation.\\n\\nText to translate: :text'\\nTranslate from: English\\nTranslate to: English\\n\\nTranslation:";

  async translate(text: string) {
    const textHash = this.convertHash(text);
    console.log('Cache miss');
    const cached = await this.redisService.get(textHash.toString());
    if (cached) {
      console.log('Cache hit');
      return cached;
    }

    const promptedText = this.prompt.replace(':text', text);
    const res = await getOllamaTranslation({
      prompt: promptedText,
      model: 'qwen2.5:3b',
      options: { temperature: 0.0 },
      stream: false,
    });

    await this.redisService.set(textHash.toString(), res.data.response);
    return res.data.response;
  }

  convertHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
