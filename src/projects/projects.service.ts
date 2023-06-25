import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from 'src/entities/projects.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Projects)
        private projectsRepository: Repository<Projects>,
        ){}
    
    // 프로젝트 생성
    async create(projectData) {
        const project = await this.projectsRepository.save(projectData);
        return {Success: true, statusCode: 201, message: '프로젝트 생성이 완료되었습니다.', projectData: project};
    }

    // 프로젝트 전체 조회
    async getProjects(userId: number) {
        const projects = await this.projectsRepository.find({
            relations: {tasks: true},
            select: {tasks: true}, 
            where: {
                users: {id: userId},
            }
        });
        return {Success: true, statusCode: 201, message: '프로젝트 전체 조회가 완료되었습니다.', projectData: projects};
    }

    // 프로젝트 개별 조회
    async getProject(id: number) {
        const project = await this.projectsRepository.findOne({
            relations: {tasks: true},
            select: {tasks: true}, 
            where: {id}
        });
        return {Success: true, statusCode: 201, message: '프로젝트 조회가 완료되었습니다.', projectData: project};
    }

    // 프로젝트 수정
    async update(id: number, projectData) {
        await this.projectsRepository.update(id, projectData);
        return {Success: true, statusCode: 200, message: '프로젝트 수정이 완료되었습니다.'};
    }

    // 프로젝트 삭제
    async delete(id: number) {
        await this.projectsRepository.delete(id);
        return {Success: true, statusCode: 200, message: '프로젝트 삭제가 완료되었습니다.'};
    }
}
