import { BaseService } from '../../lib/BaseService';
import {
  BaseResponse,
  OllamaDescriptionRequest,
  OllamaRequest,
  OllamaResponse,
} from '../types';

export async function getOllamaTranslation(
  data: OllamaRequest,
): Promise<BaseResponse<OllamaResponse>> {
  return (await BaseService({
    method: 'POST',
    url: '/api/generate',
    data,
  })) as unknown as BaseResponse<OllamaResponse>;
}

export async function getOllamaDescription(
  data: OllamaDescriptionRequest,
): Promise<BaseResponse<OllamaResponse>> {
  return (await BaseService({
    method: 'POST',
    url: '/api/generate',
    data,
  })) as unknown as BaseResponse<OllamaResponse>;
}
