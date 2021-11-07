import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users.module';

const {
  DB_HOST = 'localhost',
  DB = 'interview-task',
} = process.env;

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${DB_HOST}/${DB}`),
    UsersModule
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
