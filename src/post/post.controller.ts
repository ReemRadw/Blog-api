import { Post, Body, Req, Res, UseGuards, Controller, ValidationPipe, Query, Get, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Role } from '@prisma/client';
import { ResponseService } from 'src/services/response.service';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPost(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @Req() req: Request & { user: { sub: number; role: string } },
    @Res() res: Response,
  ) {
    const user = req.user;
    return this.postService.createPost(createPostDto, user.sub, res);
  }

  @Get()
  async getAllPosts(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Res() res: Response,
  ) {
    return this.postService.getAllPosts(Number(page), Number(limit), res);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Res() res: Response) {
    return this.postService.getPostById(Number(id), res);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() req: Request & { user: { sub: number; role: Role } },
    @Res() res: Response,
  ) {
    return this.postService.updatePost(+id, dto, req.user, res);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @Req() req: Request & { user: { sub: number; role: Role } },
    @Res() res: Response,
  ) {
    return this.postService.deletePost(+id, req.user, res);
  }
}
