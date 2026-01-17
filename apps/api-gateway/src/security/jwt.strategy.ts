/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';
import { ConfigService } from '../config/config.service';

interface JwtPayload {
  sub: string;
  email?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

interface ValidatedUser {
  userId: string;
  email?: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const secret = configService.jwtSecret;
    const opts: any = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    };

    super(opts);
    this.logger.log('JwtStrategy initialized with Bearer token extraction');
  }

  validate(payload: JwtPayload): ValidatedUser {
    this.logger.debug(
      `Validating JWT payload: ${JSON.stringify({ sub: payload?.sub, email: payload?.email, roles: payload?.roles })}`,
    );

    if (!payload || !payload.sub) {
      this.logger.warn('JWT validation failed: missing sub claim');
      throw new UnauthorizedException('Invalid token: missing sub');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
