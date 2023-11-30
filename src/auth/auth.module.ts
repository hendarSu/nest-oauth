// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

import { GoogleStrategy } from 'utils/google.strategy';
import { User, UserSchema } from 'utils/database/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [
        ConfigModule
      ],
      useFactory: (configService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: 'JWT_EXPIRES' },
      }),
      inject: [
        ConfigService
      ],
    }),
  ],
  providers: [ConfigService, AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule { }