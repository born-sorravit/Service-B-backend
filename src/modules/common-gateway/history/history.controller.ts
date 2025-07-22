import { Controller, Get, Param } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('/:username')
  findAll(@Param('username') username: string) {
    return this.historyService.findAll(username);
  }
}
