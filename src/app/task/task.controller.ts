import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/shared/dto/task.dto';

@Controller('tasks')
@ApiTags('Task')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('second')
  @ApiOperation({ summary: '테스크 생성: 방식-2', description: '테스크를 생성합니다.' })
  async createTask(@Req() req, @Body() taskData: CreateTaskDto) {
    return await this.taskService.createTask(req.user, taskData);
  }
}
