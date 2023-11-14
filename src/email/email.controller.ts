import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';

@Controller('emails')
@ApiTags('Emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
