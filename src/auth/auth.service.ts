import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'utils/database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(googleId: string, email: string): Promise<User> {
        let user = await this.userModel.findOne({ googleId });

        if (!user) {
            user = await this.userModel.create({ googleId, email });
        }

        return user;
    }

    async googleLogin(req: any): Promise<{ access_token: string }> {
        const user = req.user;

        const payload = { email: user.email, sub: user._id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async googleLoginExternal(token: string) {

        const user = this.jwtService.decode(token);

        const payload = {
            googleCredential: token,
            googleId: user.sub,
            email: user.email,
            profile: user.picture,
            name: user.name,
            email_verified: user.email_verified
        };

        const userId = await this.userUppsert(payload);

        const accessToken = this.jwtService.sign({... payload, sub: userId['_id']}, { expiresIn: '1d' });

        return {
            success: true,
            message: 'Generate token successfully',
            data: {
                access_token: accessToken
            }
        }
    }

    async userUppsert(payload): Promise<User> {
        let user = await this.userModel.findOne({ googleId: payload.googleId });
        if (!user) {
            user = await this.userModel.create(payload);
        } else {
            user = await this.userModel.findOneAndUpdate({ googleId: payload.googleId }, payload, { new: true });
        }

        return user;
    }
}
