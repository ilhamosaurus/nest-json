import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const diff = process.hrtime(startAt);
      const responseTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(1);

      if (statusCode >= 400) {
        this.logger.error(
          `${method} | ${originalUrl} | ${statusCode} | ${responseTime}ms | ${contentLength} -  ${ip}\n`,
        );
      } else {
        this.logger.verbose(
          `${method} | ${originalUrl} | ${statusCode} | ${responseTime}ms | ${contentLength} - ${ip}\n`,
        );
      }
    });

    next();
  }
}
