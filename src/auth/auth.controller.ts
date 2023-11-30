// auth.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: any) {
    return this.authService.googleLogin(req);
  }

  @Post('google/callback/external')
  @HttpCode(HttpStatus.OK)
  googleLoginCallbackExternall(@Body() payload) {
    const { credential } = payload;
    return this.authService.googleLoginExternal(credential);
  }
}
