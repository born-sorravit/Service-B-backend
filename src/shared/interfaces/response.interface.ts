import { IMeta } from 'src/utils/paginate';

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta;
  metadata?: {
    timestamp: string;
    path?: string;
  };
}
