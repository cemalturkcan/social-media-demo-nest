export interface Options {
  temperature: number;
}

export interface message {
  message: string;
  role: string;
}

export interface OllamaRequest {
  model: string;
  prompt?: string;
  format?: string;
  stream: boolean;
  options?: Options;
}

export interface OllamaDescriptionRequest extends OllamaRequest {
  images: string[];
}
export interface OllamaResponse {
  response: string;
}

export interface BaseResponse<T> {
  data: T;
}
