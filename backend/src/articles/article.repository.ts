import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './entities/article.model';
import { FindOptions, Op } from 'sequelize';

@Injectable()
export class ArticleRepository {
    constructor(
        @InjectModel(Article)
        private articleModel: typeof Article,
    ) {}

    async findAll(options?: FindOptions): Promise<Article[]> {
        return this.articleModel.findAll({
            ...options,
            order: [['publishDate', 'DESC']],
        });
    }

    async findAndCountAll(
        page: number = 1,
        pageSize: number = 10,
        options?: FindOptions,
    ): Promise<{ rows: Article[]; count: number }> {
        return this.articleModel.findAndCountAll({
            ...options,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['publishDate', 'DESC']],
        });
    }

    async findByDateRange(
        startDate: Date,
        endDate: Date,
        page: number = 1,
        pageSize: number = 10,
    ): Promise<{ rows: Article[]; count: number }> {
        return this.articleModel.findAndCountAll({
            where: {
                publishDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['publishDate', 'DESC']],
        });
    }

    async findById(id: string): Promise<Article> {
        return this.articleModel.findByPk(id);
    }

    async updateSummary(id: string, summary: string): Promise<void> {
        await this.articleModel.update(
            { summary: summary },
            { where: { trendingId: id } },
        );
    }

    async findByCategory(
        category: string,
        page: number = 1,
        pageSize: number = 10,
    ): Promise<{ rows: Article[]; count: number }> {
        return this.articleModel.findAndCountAll({
            where: {
                mainCategory: category,
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['publishDate', 'DESC']],
        });
    }

    async findTrendingArticles(
        page: number = 1,
        pageSize: number = 10,
        minScore: number = 0,
    ): Promise<{ rows: Article[]; count: number }> {
        return this.articleModel.findAndCountAll({
            where: {
                similarityScore: {
                    [Op.gte]: minScore,
                },
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [
                ['similarityScore', 'DESC'],
                ['publishDate', 'DESC'],
            ],
        });
    }

    async findTrendingArticlesByCategory(
        category: string,
        page: number = 1,
        pageSize: number = 10,
        minScore: number = 0,
    ): Promise<{ rows: Article[]; count: number }> {
        return this.articleModel.findAndCountAll({
            where: {
                mainCategory: category,
                similarityScore: {
                    [Op.gte]: minScore,
                },
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [
                ['similarityScore', 'DESC'],
                ['publishDate', 'DESC'],
            ],
        });
    }

    async findByUrl(url: string): Promise<Article | null> {
        return Article.findOne({
            where: { url },
        });
    }

    async findByUrls(urls: string[]): Promise<Article[]> {
        return Article.findAll({
            where: {
                url: {
                    [Op.in]: urls,
                },
            },
        });
    }
}
