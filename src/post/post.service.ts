import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/services/prisma.service';
import { ResponseService } from 'src/services/response.service';
import { Response } from 'express';
import { Role } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(dto: CreatePostDto, userId: number, res: Response) {
    try {
      const post = await this.prisma.post.create({
        data: {
          title: dto.title,
          content: dto.content,
          userId: userId,
        },
      });

      return ResponseService.created(res, 'Post created successfully', post);
    } catch (error) {
      console.error('Create Post Error:', error);
      return ResponseService.internalServerError(res);
    }

  }

  async getAllPosts(page: number, limit: number, res: Response) {
    try {
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, userName: true, role: true } },
          },
        }),
        this.prisma.post.count(),
      ]);

      return ResponseService.success(res, 'Posts fetched successfully', {
        data: posts,
        total,
        page,
        pageCount: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('Get All Posts Error:', error);
      return ResponseService.internalServerError(res);
    }
  }

  async getPostById(id: number, res: Response) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, userName: true, role: true } },
        },
      });

      if (!post) {
        return ResponseService.notFound(res, `Post with ID ${id} not found`);
      }

      return ResponseService.success(res, 'Post fetched successfully', post);
    } catch (error) {
      console.error('Get Post By ID Error:', error);
      return ResponseService.internalServerError(res);
    }
  }

  async updatePost(id: number, dto: UpdatePostDto, user: { sub: number; role: Role }, res: Response) {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } });
  
      if (!post) {
        return ResponseService.notFound(res, `Post with ID ${id} not found`);
      }
  
      if (user.role !== Role.ADMIN && post.userId !== user.sub) {
        return ResponseService.forbidden(res, 'You can only edit your own posts');
      }
  
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: {
          title: dto.title,
          content: dto.content,
        },
      });
  
      return ResponseService.success(res, 'Post updated successfully', updatedPost);
    } catch (error) {
      console.error('Update Post Error:', error);
      return ResponseService.internalServerError(res);
    }
  }
  
  async deletePost(id: number, user: { sub: number; role: Role }, res: Response) {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } });
  
      if (!post) {
        return ResponseService.notFound(res, `Post with ID ${id} not found`);
      }
  
      if (user.role !== Role.ADMIN && post.userId !== user.sub) {
        return ResponseService.forbidden(res, 'You can only delete your own posts');
      }
  
      await this.prisma.post.delete({ where: { id } });
  
      return ResponseService.success(res, 'Post deleted successfully');
    } catch (error) {
      console.error('Delete Post Error:', error);
      return ResponseService.internalServerError(res);
    }
  }
}
