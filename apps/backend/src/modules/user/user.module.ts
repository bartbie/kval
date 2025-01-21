import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ensemble, EnsembleSchema, User, UserSchema } from 'src/schemas';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Ensemble.name, schema: EnsembleSchema },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [],
})
export class UserModule {}
