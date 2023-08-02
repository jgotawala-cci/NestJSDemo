import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
const split = '&';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See email is exist
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email is already exists!');
    }
    // Hash user password
    // - generate salt
    const salt = randomBytes(8).toString('hex');

    // - join password and salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // - join has result and salt
    const result = salt + split + hash.toString('hex');

    // Create a user
    const user = await this.usersService.create(email, result);

    // return created user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('No user found!');
    }
    const [salt, storedHash] = user.password.split(split);

    // - join password and salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password entered!');
    }
    return user;
  }
}
