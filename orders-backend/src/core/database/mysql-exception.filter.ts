import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class MysqlExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const err = exception.driverError as any;

    const mapped = this.mapMysqlError(err);

    response.status(mapped.statusCode).json({
      statusCode: mapped.statusCode,
      message: mapped.message,
      ...(mapped.details && { details: mapped.details }),
    });
  }

  private mapMysqlError(err: any): {
    statusCode: number;
    message: string;
    details?: any;
  } {
    switch (err?.errno) {
      case 1062: // ER_DUP_ENTRY
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Resource already exists',
          details: {
            field: this.extractKey(err.sqlMessage),
          },
        };

      case 1452: // FK violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference',
        };

      case 1048: // NOT NULL
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Missing required field',
        };

      case 1364: // NOT DEFAULT VALUE ON FIELD
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Not default value on field',
        };

      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error ('+err?.errno+') >> '+err.sqlMessage,
        };
    }
  }

  private extractKey(sqlMessage?: string): string | undefined {
    if (!sqlMessage) return undefined;
    return sqlMessage.match(/key '(.+?)'/)?.[1];
  }
}
