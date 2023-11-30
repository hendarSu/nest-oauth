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
}
