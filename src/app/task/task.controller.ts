import { Body, Controller, Delete, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from 'src/shared/dto/task.dto';

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

  @Put(':taskId')
  @ApiOperation({ summary: '테스크 수정: 방식-2', description: '테스크를 수정합니다.' })
  @ApiParam({
    name: 'taskId',
    example: 1,
  })
  async updateTask(@Req() req, @Param('taskId') taskId: number, @Body() taskData: UpdateTaskDto) {
    return await this.taskService.updateTask(req.user, taskId, taskData);
  }

  @Delete(':taskId')
  @ApiOperation({ summary: '테스크 삭제', description: '테스크를 삭제합니다.' })
  @ApiParam({
    name: 'taskId',
    example: 1,
  })
  async deleteTask(@Req() req, @Param('taskId') taskId: number) {
    return await this.taskService.deleteTask(req.user, taskId);
  }
}
