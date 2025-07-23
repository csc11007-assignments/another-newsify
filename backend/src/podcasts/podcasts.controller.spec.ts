import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedPodcastsResponseDto } from './dtos/paginated-podcasts-response.dto';
import { PodcastResponseDto } from './dtos/podcast-response.dto';
import { PodcastsController } from './podcasts.controller';
import { PodcastsService } from './podcasts.service';

describe('PodcastsController', () => {
    let controller: PodcastsController;
    let podcastsService: jest.Mocked<PodcastsService>;

    const mockPodcastResponse: PodcastResponseDto = {
        podcast_id: '1',
        title: 'Test Podcast',
        audio_url: { value: 'http://example.com/audio.mp3' } as any,
        length_seconds: { value: 3600 } as any,
        publish_date: new Date('2023-01-01').toISOString(),
        script: '',
        timestamp_script: {},
        links: [],
    };

    const mockPaginatedResponse: PaginatedPodcastsResponseDto = {
        podcasts: [mockPodcastResponse],
        total: 1,
        page: 1,
        pageSize: 10,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PodcastsController],
            providers: [
                {
                    provide: PodcastsService,
                    useValue: {
                        getAllPodcasts: jest.fn(),
                        getPodcastsBetweenDatesWithPagination: jest.fn(),
                        getPodcastById: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<PodcastsController>(PodcastsController);
        podcastsService = module.get(PodcastsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPodcasts', () => {
        it('should return paginated podcasts', async () => {
            podcastsService.getAllPodcasts.mockResolvedValue(
                mockPaginatedResponse,
            );
            const result = await controller.getAllPodcasts({
                page: 1,
                pageSize: 10,
            });
            expect(result).toEqual(mockPaginatedResponse);
            expect(podcastsService.getAllPodcasts).toHaveBeenCalledWith(1, 10);
        });
    });

    describe('getPodcastsByDateRangePaginated', () => {
        it('should return podcasts within date range', async () => {
            podcastsService.getPodcastsBetweenDatesWithPagination.mockResolvedValue(
                mockPaginatedResponse,
            );
            const result = await controller.getPodcastsByDateRangePaginated({
                startTime: '2023-01-01',
                endTime: '2023-01-31',
                page: 1,
                pageSize: 10,
            });
            expect(result).toEqual(mockPaginatedResponse);
            expect(
                podcastsService.getPodcastsBetweenDatesWithPagination,
            ).toHaveBeenCalledWith('2023-01-01', '2023-01-31', 1, 10);
        });
    });

    describe('getPodcastById', () => {
        it('should return podcast by id', async () => {
            podcastsService.getPodcastById.mockResolvedValue(
                mockPodcastResponse,
            );
            const result = await controller.getPodcastById('1');
            expect(result).toEqual(mockPodcastResponse);
            expect(podcastsService.getPodcastById).toHaveBeenCalledWith('1');
        });
        it('should throw NotFoundException when podcast not found', async () => {
            podcastsService.getPodcastById.mockRejectedValue(
                new NotFoundException(),
            );
            await expect(controller.getPodcastById('999')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
