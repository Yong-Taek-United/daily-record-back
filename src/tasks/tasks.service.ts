import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from 'src/entities/tasks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks)
        private tasksRepository: Repository<Tasks>,
        ){}
    
    // 할일 생성
    async create(taskDatas) {
        taskDatas.map(async(taskData) => await this.tasksRepository.save(taskData));
        return {Success: true, statusCode: 201, message: '할일 생성이 완료되었습니다.'};
    }

    // 할일 전체 조회
    async getTasks(userId: number) {
        const tasks = await this.tasksRepository.find({
            where: {
                users: {id: userId},
            }
        });
        return {Success: true, statusCode: 201, message: '할일 전체 조회가 완료되었습니다.', taskData: tasks};
    }

    // 할일 전체 조회(in project)
    async getTasksInProject(userId: number, projectId: number) {
        const tasks = await this.tasksRepository.find({
            where: {
                users: {id: userId},
                projects: {id: projectId}
            }
        });
        return {Success: true, statusCode: 201, message: '할일 전체 조회가 완료되었습니다.', taskData: tasks};
    }

    // 할일 개별 조회
    async getTask(id: number) {
        const task = await this.tasksRepository.findOne({where: {id}});
        return {Success: true, statusCode: 201, message: '할일 조회가 완료되었습니다.', taskData: task};
    }

    // 할일 수정
    async update(id: number, taskData) {
        await this.tasksRepository.update(id, taskData);
        return {Success: true, statusCode: 200, message: '할일 수정이 완료되었습니다.'};
    }

    // 할일 삭제
    async delete(id: number) {
        await this.tasksRepository.delete(id);
        return {Success: true, statusCode: 200, message: '할일 삭제가 완료되었습니다.'};
    }
}
