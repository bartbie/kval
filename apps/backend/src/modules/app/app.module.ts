import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from '../../env';
import { UUID } from 'bson';
import { AuthModule } from '../auth/auth.module';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { UserModule } from '../user/user.module';

@Catch(ZodError)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    console.warn(exception.toString());
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: exception.issues,
    });
  }
}

const modules = [AuthModule, UserModule] as const;

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGO_URL, {
      pkFactory: { createPk: () => new UUID().toString() },
      connectionFactory: (connection) => {
        mongoose.Schema.ObjectId.cast((x: object) => `${x}`);
        mongoose.Schema.ObjectId.get((v: any) => v?.toString());
        connection.set('toJSON', {
          transform: (_: any, ret: any) => {
            const converted = { ...ret };
            if (converted._id) converted._id = converted._id.toString();
            return converted;
          },
        });
        return connection;
      },
    }),
    ...modules,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ZodValidationExceptionFilter,
    },
  ],
})
export class AppModule {}
