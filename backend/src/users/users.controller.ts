import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ProfileDto } from '../auth/dtos/cred.dto';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';
import { UsersService } from './users.service';

// trigger jenkins
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @ApiOperation({
        summary: 'Get profile with credentials',
    })
    @ApiBearerAuth('access-token')
    @Get('user')
    @ApiResponse({
        status: 200,
        description: 'Get profile successfully',
        type: ProfileDto,
    })
    @UseGuards(ATAuthGuard)
    async getMyProfile(@Request() req: any, @Res() res: Response) {
        const foundUser: {
            email: string;
            username: string;
        } = await this.usersService.getMyProfile(req.user);
        res.send(foundUser);
    }
}
