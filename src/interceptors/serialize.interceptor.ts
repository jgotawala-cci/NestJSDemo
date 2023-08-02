import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';

interface ClassConstuctor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstuctor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstuctor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // run something before a request handled
    // by the request handler

    return next.handle().pipe(
      map((data: ClassConstuctor) => {
        // run something befor reponse is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
