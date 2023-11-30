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
import jwtConfig from 'utils/strategy/config';
import { JwtStrategy } from 'utils/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
    }),
    PassportModule.register({ defaultStrategy: 'google' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [
        ConfigModule
      ],
      useFactory: (configService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [
        ConfigService
      ],
    }),
  ],
  providers: [
    ConfigService,
    AuthService,
    GoogleStrategy,
    JwtStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule { }