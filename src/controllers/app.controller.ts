import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../services/app.service';
import axios from 'axios';

interface Response {
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
