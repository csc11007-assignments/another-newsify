import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from '../search/search.service';
import { SyncService } from '../search/sync.service';
import { ArticleRepository } from './article.repository';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

class ArticleRepositoryMock {}
class SyncServiceMock {}

const configServiceMock = {
    get: (key: string) => {
        switch (key) {
            case 'ELS_IP':
                return 'http://localhost:9200';
            case 'ELS_USERNAME':
                return 'elastic';
            case 'ELS_PASSWORD':
                return 'changeme';
            case 'OPENAI_API_KEY':
                return 'dummy-key';
            default:
                return '';
        }
    },
};

describe('ArticlesModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            controllers: [ArticlesController],
            providers: [
                ArticlesService,
                { provide: ArticleRepository, useClass: ArticleRepositoryMock },
                { provide: SyncService, useClass: SyncServiceMock },
                { provide: ConfigService, useValue: configServiceMock },
                { provide: SearchService, useValue: {} },
            ],
        }).compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide ArticlesService', () => {
        const service = module.get<ArticlesService>(ArticlesService);
        expect(service).toBeInstanceOf(ArticlesService);
    });

    it('should provide ArticlesController', () => {
        const controller = module.get<ArticlesController>(ArticlesController);
        expect(controller).toBeInstanceOf(ArticlesController);
    });

    it('should provide ArticleRepository', () => {
        const repo = module.get<ArticleRepository>(ArticleRepository);
        expect(repo).toBeInstanceOf(ArticleRepositoryMock);
    });

    it('should provide SyncService', () => {
        const sync = module.get<SyncService>(SyncService);
        expect(sync).toBeInstanceOf(SyncServiceMock);
    });
});
