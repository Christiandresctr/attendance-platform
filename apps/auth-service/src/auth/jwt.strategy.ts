import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY_DEMO',
    });
  }

  async validate(payload: any) {
    // try to fetch user to attach latest roles and info
    if (payload?.sub) {
      const user = await this.userRepo.findOne({ where: { id: payload.sub }, relations: ['roles'] });
      if (user) {
        return { id: user.id, email: user.email, roles: user.roles?.map((r) => r.name) || [] };
      }
    }
    return payload;
  }
}
