import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // 할일 생성
  @Post()
  create(@Body() taskData) {
    return this.tasksService.create(taskData);
  }

  // 할일 전체 조회
  @Get('/getTasks/:id')
  getTasks(@Param('id') userId: number) {
    return this.tasksService.getTasks(userId);
  }
  // 할일 전체 조회(in project)
  @Get('/getTasksInProject/:userId/:projectId')
  getTasksInProject(@Param('userId') userId: number, @Param('projectId') projectId: number) {
    return this.tasksService.getTasksInProject(userId, projectId);
  }

  // 할일 개별 조회
  @Get('/:id')
  getTask(@Param('id') taskId: number) {
    return this.tasksService.getTask(taskId);
  }

  // 할일 수정
  @Patch('/:id')
  update(@Param('id') taskId: number, @Body() taskData) {
    return this.tasksService.update(taskId, taskData);
  }

  // 할일 삭제
  @Delete('/:id')
  delete(@Param('id') taskId: number) {
    return this.tasksService.delete(taskId);
  }
}
