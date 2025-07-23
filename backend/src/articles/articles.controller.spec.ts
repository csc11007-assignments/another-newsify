import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SearchResponseDto } from '../search/dtos/search-response.dto';
import { SearchService } from '../search/search.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleResponseDto } from './dtos/article-response.dto';
import { PaginatedArticlesResponseDto } from './dtos/paginated-articles-response.dto';

describe('ArticlesController', () => {
    let controller: ArticlesController;
    let articlesService: jest.Mocked<ArticlesService>;
    let searchService: jest.Mocked<SearchService>;

    const mockArticleResponse: ArticleResponseDto = {
        trending_id: 'trending1',
        article_id: 'article1',
        url: 'http://example.com/article1',
        title: 'Test Article',
        publish_date: new Date('2023-01-01').toISOString(),
        analyzed_date: null,
        summary: 'Test summary',
        main_category: 'Technology',
        categories: ['Tech', 'News'],
        image_url: 'http://example.com/image1.jpg',
        trend: undefined,
        similarity_score: 0.8,
    };

    const mockPaginatedResponse: PaginatedArticlesResponseDto = {
        articles: [mockArticleResponse],
        total: 1,
        page: 1,
        pageSize: 10,
    };

    const mockSearchResponse: SearchResponseDto = {
        results: [mockArticleResponse],
        total: 1,
        page: 1,
        size: 20,
    } as any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ArticlesController],
            providers: [
                {
                    provide: ArticlesService,
                    useValue: {
                        getAllArticles: jest.fn(),
                        getArticlesBetweenDatesWithPagination: jest.fn(),
                        getArticlesByCategory: jest.fn(),
                        getTrendingArticles: jest.fn(),
                        getTrendingArticlesByCategory: jest.fn(),
                        getRelatedArticles: jest.fn(),
                        getArticleById: jest.fn(),
                    },
                },
                {
                    provide: SearchService,
                    useValue: {
                        searchArticles: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ArticlesController>(ArticlesController);
        articlesService = module.get(ArticlesService);
        searchService = module.get(SearchService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllArticles', () => {
        it('should return paginated articles', async () => {
            articlesService.getAllArticles.mockResolvedValue(
                mockPaginatedResponse,
            );
            const result = await controller.getAllArticles({
                page: 1,
                pageSize: 10,
            });
            expect(result).toEqual(mockPaginatedResponse);
            expect(articlesService.getAllArticles).toHaveBeenCalledWith(1, 10);
        });
    });

    describe('getArticlesByDateRangePaginated', () => {
        it('should return articles within date range', async () => {
            articlesService.getArticlesBetweenDatesWithPagination.mockResolvedValue(
                mockPaginatedResponse,
            );
            const result = await controller.getArticlesByDateRangePaginated({
                startTime: '2023-01-01',
                endTime: '2023-01-31',
                page: 1,
                pageSize: 10,
            });
            expect(result).toEqual(mockPaginatedResponse);
            expect(
                articlesService.getArticlesBetweenDatesWithPagination,
            ).toHaveBeenCalledWith('2023-01-01', '2023-01-31', 1, 10);
        });
    });

    describe('getArticlesByCategory', () => {
        it('should return articles by category', async () => {
            articlesService.getArticlesByCategory.mockResolvedValue(
                mockPaginatedResponse,
            );
            const result = await controller.getArticlesByCategory({
                category: 'Technology',
                page: 1,
                pageSize: 10,
            });
            expect(result).toEqual(mockPaginatedResponse);
            expect(articlesService.getArticlesByCategory).toHaveBeenCalledWith(
                'Technology',
                1,
                10,
            );
        });
    });

    describe('searchArticles', () => {
        it('should return search results', async () => {
            searchService.searchArticles.mockResolvedValue(mockSearchResponse);
            const result = await controller.searchArticles('ai', 1, 20);
            expect(result).toEqual(mockSearchResponse);
            expect(searchService.searchArticles).toHaveBeenCalledWith(
                'ai',
                1,
                20,
            );
        });
    });

    describe('getTrendingArticles', () => {
        it('should return trending articles', async () => {
            articlesService.getTrendingArticles.mockResolvedValue(
                mockPaginatedResponse,
            );
            const result = await controller.getTrendingArticles({
                page: 1,
                pageSize: 10,
                minScore: 0,
            });
            expect(result).toEqual(mockPaginatedResponse);
            expect(articlesService.getTrendingArticles).toHaveBeenCalledWith(
                1,
                10,
                0,
            );
        });
        it('should return trending articles by category', async () => {
            articlesService.getTrendingArticlesByCategory.mockResolvedValue(
                mockPaginatedResponse,
            );
            const result = await controller.getTrendingArticles({
                category: 'Technology',
                page: 1,
                pageSize: 10,
                minScore: 0,
            });
            expect(result).toEqual(mockPaginatedResponse);
            expect(
                articlesService.getTrendingArticlesByCategory,
            ).toHaveBeenCalledWith('Technology', 1, 10, 0);
        });
    });

    describe('getRelatedArticles', () => {
        it('should return related articles', async () => {
            articlesService.getRelatedArticles.mockResolvedValue([
                mockArticleResponse,
            ]);
            const result = await controller.getRelatedArticles(
                'http://example.com/article1',
            );
            expect(result).toEqual([mockArticleResponse]);
            expect(articlesService.getRelatedArticles).toHaveBeenCalledWith(
                'http://example.com/article1',
            );
        });
    });

    describe('getArticleById', () => {
        it('should return article by id', async () => {
            articlesService.getArticleById.mockResolvedValue(
                mockArticleResponse,
            );
            const result = await controller.getArticleById('1');
            expect(result).toEqual(mockArticleResponse);
            expect(articlesService.getArticleById).toHaveBeenCalledWith('1');
        });
        it('should throw NotFoundException when article not found', async () => {
            articlesService.getArticleById.mockRejectedValue(
                new NotFoundException(),
            );
            await expect(controller.getArticleById('999')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
