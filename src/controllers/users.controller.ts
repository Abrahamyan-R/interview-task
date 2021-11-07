import { Controller, Get, Post, Body, Put, Param, Delete, Sse, Req } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { interval, map, Observable } from 'rxjs';
import { EventEmitter } from 'events';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  private userEvents: EventEmitter;
  constructor(private readonly usersService: UsersService) {
    this.userEvents = new EventEmitter();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    this.userEvents.emit('change', new MessageEvent('userAdded', { data: createdUser }));
    return createdUser;
  }

  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }

  @Put(':id')
  async update(@Param() params, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateById(params.id, updateUserDto);
    this.userEvents.emit('change', new MessageEvent('userUpdated', { data: updatedUser }));
    return updatedUser;
  }

  @Delete(':id')
  async delete(@Param() params) {
    const deletedUser = await this.usersService.deleteById(params.id);
    this.userEvents.emit('change', new MessageEvent('userDeleted', { data: deletedUser }));
    return deletedUser;
  }


  @Sse('sse')
  sse(@Req() request: Request): Observable<MessageEvent> {
    return new Observable(subscriber => {
      this.userEvents.on('change', (change: MessageEvent) => {
        subscriber.next(change);
      });
    });
  }  
}