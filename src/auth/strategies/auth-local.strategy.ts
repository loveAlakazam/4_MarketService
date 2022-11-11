import { Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { HttpExceptionFilter } from '../../commons/filters/http-exception/http-exception.filter';
import { UnableLoginException } from '../../users/users.exception';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnableLoginException();
    }
    return user;
  }
}
