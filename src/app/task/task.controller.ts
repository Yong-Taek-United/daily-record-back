import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from 'src/shared/dto/task.dto';

@Controller('tasks')
@ApiTags('Task')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  @ApiOperation({ summary: '테스크 생성', description: '테스크를 생성합니다.' })
  async createTask(@Req() req, @Body() taskData: CreateTaskDto) {
    const data = await this.taskService.createTask(req.user, taskData);
    return { statusCode: 201, data };
  }

  @Get('list/:projectId')
  @ApiOperation({ summary: '테스크 목록 조회', description: '특정 프로젝트의 테스크 목록을 조회합니다.' })
  @ApiParam({
    name: 'projectId',
    example: 1,
  })
  async getTaskList(@Req() req, @Param('projectId') projectId: number) {
    const data = await this.taskService.getTaskList(req.user, projectId);
    return { statusCode: 200, data };
  }

  @Put(':taskId')
  @ApiOperation({ summary: '테스크 수정', description: '테스크를 수정합니다.' })
  @ApiParam({
    name: 'taskId',
    example: 1,
  })
  async updateTask(@Req() req, @Param('taskId') taskId: number, @Body() taskData: UpdateTaskDto) {
    const data = await this.taskService.updateTask(req.user, taskId, taskData);
    return { statusCode: 200, data };
  }

  @Delete(':taskId')
  @ApiOperation({ summary: '테스크 삭제', description: '테스크를 삭제하고 연결된 액티비티 관계를 해제(null)합니다.' })
  @ApiParam({
    name: 'taskId',
    example: 1,
  })
  async deleteTask(@Req() req, @Param('taskId') taskId: number) {
    const data = await this.taskService.deleteTask(req.user, taskId);
    return { statusCode: 200, data };
  }

  @Get('self/:projectId/list/for-activity')
  @ApiOperation({
    summary: '나의 테스크 목록 조회: 액티비티 생성',
    description: '액티비티 생성 시 연결할 현재 활성화 중인 테스크 목록을 조회합니다.',
  })
  @ApiParam({
    name: 'projectId',
  })
  async getTaskForActivity(@Req() req, @Param('projectId') projectId: number) {
    const data = await this.taskService.getTaskForActivity(req.user, projectId);
    return { statusCode: 200, data };
  }
}
