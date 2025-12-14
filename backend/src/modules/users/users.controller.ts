import {
    Controller,
    Get,
    Put,
    Delete,
    Param,
    Body,
    Headers,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * Get user profile
     */
    @Get(':userId')
    async getUser(
        @Param('userId') userId: string,
        @Headers('x-user-id') requestingUserId: string,
    ) {
        // Verify requesting user is the same as the user being fetched
        if (requestingUserId !== userId) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.usersService.getUser(userId);
        return { user };
    }

    /**
     * Update user profile
     */
    @Put(':userId/profile')
    async updateProfile(
        @Param('userId') userId: string,
        @Headers('x-user-id') requestingUserId: string,
        @Body() body: { profile: Record<string, any> },
    ) {
        if (requestingUserId !== userId) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.usersService.updateProfile(userId, body.profile);
        return { user };
    }

    /**
     * Delete user account (LGPD compliance)
     */
    @Delete(':userId')
    async deleteUser(
        @Param('userId') userId: string,
        @Headers('x-user-id') requestingUserId: string,
    ) {
        if (requestingUserId !== userId) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        await this.usersService.deleteUser(userId);
        return { success: true, message: 'User deleted successfully' };
    }
}
