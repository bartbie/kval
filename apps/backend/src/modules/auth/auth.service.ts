import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { User } from '../../schemas';
import * as auth from '../../lib/auth';
import * as api from '@libs/api';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    private jwtService: JwtService,
  ) {}

  async verifyToken(token: auth.TokenUnverified | auth.Token) {
    return await auth.verifyToken(this.jwtService, this.model, token);
  }

  async login(credentials: auth.UserCredentials) {
    return await auth.login(this.jwtService, this.model, credentials);
  }

  async signup(data: api.SignUpInput) {
    return await auth.signup(this.jwtService, this.model, {
      ...data,
      age: 18,
      bio: '',
      instruments: [],
      genres: [],
    });
  }
}
