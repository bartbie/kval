import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema, signupSchema, userViewWithEmailSchema } from '@libs/api';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ok } from '@libs/shared';

class LoginCred extends createZodDto(loginSchema) {}
class SignupCred extends createZodDto(signupSchema) {}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() cred: LoginCred) {
    const res = await this.authService.login(cred);
    if (!res.success) return res;
    return ok({ token: res.data.token });
  }

  @Post('/signup')
  async signup(@Body() cred: SignupCred) {
    const res = await this.authService.signup(cred);
    if (!res.success) return res;
    return ok({ token: res.data.token });
  }
}
