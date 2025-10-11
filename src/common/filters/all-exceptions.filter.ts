import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let formattedMessage: string;

    if (typeof message === 'string') {
      formattedMessage = message;
    } else if (
      typeof message === 'object' &&
      message !== null &&
      'message' in message
    ) {
      formattedMessage = String((message as { message: unknown }).message);
    } else {
      formattedMessage = 'Unexpected error';
    }

    response.status(status).send({
      success: false,
      statusCode: status,
      message: formattedMessage,
    });
  }
}
