import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from './entities/user.entity';
import { Posting } from './entities/posting.entity';
import { Hashtag } from './entities/hashtag.entity';
import { PostingHashtag } from './entities/posting-hashtag.entity';
import { PostingsModule } from './postings/postings.module';
import { StatisticsModule } from './statistics/statistics.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true, // development 환경에서만 사용
        logging: true,
        namingStrategy: new SnakeNamingStrategy(), // camelCase 변수를 DB에서 snake_case로 변경
      }),
    }),
    TypeOrmModule.forFeature([User, Posting, Hashtag, PostingHashtag]),
    PostingsModule,
    StatisticsModule,
    UsersModule,
    AuthModule,
    PostingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
