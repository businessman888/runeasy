import {
    Controller,
    Post,
    Body,
    Headers,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('users')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    /**
     * Save user's push token
     */
    @Post('push-token')
    async savePushToken(
        @Headers('x-user-id') userId: string,
        @Body() dto: { push_token: string },
    ) {
        if (!userId) {
            throw new HttpException('User ID required', HttpStatus.UNAUTHORIZED);
        }

        if (!dto.push_token) {
            throw new HttpException('Push token required', HttpStatus.BAD_REQUEST);
        }

        await this.notificationService.savePushToken(userId, dto.push_token);

        return { success: true };
    }

    /**
     * Test push notification (for development)
     */
    @Post('test-notification')
    async testNotification(@Headers('x-user-id') userId: string) {
        if (!userId) {
            throw new HttpException('User ID required', HttpStatus.UNAUTHORIZED);
        }

        const sent = await this.notificationService.sendPushNotification(
            userId,
            '🧪 Notificação de Teste',
            'Se você está vendo isso, as notificações estão funcionando!',
            { type: 'test' },
        );

        return { success: sent };
    }
}
