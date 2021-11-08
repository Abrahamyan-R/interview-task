import { Controller, Get, Post, Body, Put, Param, Delete, Sse, Req, Res } from '@nestjs/common';
import { UsersService } from '@services/users.service';
import { CreateUserDto, GetUserDto, UpdateUserDto } from '@dtos/user.dto';
import { Observable } from 'rxjs';
import { EventEmitter } from 'events';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  private userEvents: EventEmitter;
  private userEventName: string;

  constructor(private readonly usersService: UsersService) {
    this.userEvents = new EventEmitter();
    this.userEventName = 'change';
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    this.userEvents.emit(this.userEventName, new MessageEvent('userAdded', { data: createdUser }));
    return createdUser;
  }

  @Get()
  async getAll(@Res() res: Response) {
    const users: GetUserDto[] = await this.usersService.getAll();
    if (users.length === 0) {
      return res.status(204).json({ message: 'no data' });
    }

    res.json({ data: users });
  }

  @Put(':id')
  async update(@Res() res: Response, @Param() params, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateById(params.id, updateUserDto);

    if (!updatedUser) {
      return res.status(404).json({ message: 'There is no user with specified id' });
    }

    this.userEvents.emit(this.userEventName, new MessageEvent('userUpdated', { data: updatedUser }));
    res.status(200).json({ data: updatedUser });
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param() params) {
    const deletedUser = await this.usersService.deleteById(params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'There is no user with specified id'});
    }

    this.userEvents.emit(this.userEventName, new MessageEvent('userDeleted', { data: deletedUser }));
    res.status(200).json({ data: deletedUser });
  }

  @Sse('sse')
  sse(@Req() request: Request): Observable<MessageEvent> {
    return new Observable(subscriber => {
      const emitter = (change: MessageEvent) => {
        subscriber.next(change);
      }

      this.userEvents.on(this.userEventName, emitter);
      request.on('error', () => this.userEvents.off(this.userEventName, emitter));
      request.on('close', () => this.userEvents.off(this.userEventName, emitter));
    });
  }
}