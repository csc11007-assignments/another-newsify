import { Test, TestingModule } from '@nestjs/testing';
import { PodcastRepository } from './podcast.repository';
import { PodcastsController } from './podcasts.controller';
import { PodcastsService } from './podcasts.service';

class PodcastRepositoryMock {}

describe('PodcastsModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            controllers: [PodcastsController],
            providers: [
                PodcastsService,
                { provide: PodcastRepository, useClass: PodcastRepositoryMock },
                {
                    provide: 'default_IORedisModuleConnectionToken',
                    useValue: {},
                },
            ],
        }).compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide PodcastsService', () => {
        const service = module.get<PodcastsService>(PodcastsService);
        expect(service).toBeInstanceOf(PodcastsService);
    });

    it('should provide PodcastsController', () => {
        const controller = module.get<PodcastsController>(PodcastsController);
        expect(controller).toBeInstanceOf(PodcastsController);
    });

    it('should provide PodcastRepository', () => {
        const repo = module.get<PodcastRepository>(PodcastRepository);
        expect(repo).toBeInstanceOf(PodcastRepositoryMock);
    });
});
