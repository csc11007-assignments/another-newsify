import Image from 'next/image';
import { Podcast } from '@/types/podcast';
import { useState, useEffect } from 'react';
import { getPodcastLength } from '@/utils/format-helpers';

interface PodcastGridProps {
    initialPodcasts: Podcast[];
    currentPodcastId?: string;
    onPodcastSelect: (podcast: Podcast) => void;
}

export const PodcastGrid: React.FC<PodcastGridProps> = ({
    initialPodcasts,
    currentPodcastId,
    onPodcastSelect,
}) => {
    const [podcasts, setPodcasts] = useState<Podcast[]>(initialPodcasts);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 4;

    useEffect(() => {
        if (initialPodcasts.length > 0) {
            setPodcasts(initialPodcasts);
            setTotalPages(
                Math.max(Math.ceil(initialPodcasts.length / itemsPerPage), 1),
            );
        }
    }, [initialPodcasts]);

    useEffect(() => {
        fetchPodcasts(currentPage);
    }, [currentPage]);

    const fetchPodcasts = async (page: number) => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `/api/podcasts?page=${page}&pageSize=${itemsPerPage}`,
            );

            if (!response.ok) {
                throw new Error(`Error fetching podcasts: ${response.status}`);
            }

            const data = await response.json();

            if (data && Array.isArray(data.podcasts)) {
                setPodcasts(data.podcasts);

                if (data.total !== undefined) {
                    setTotalPages(Math.ceil(data.total / itemsPerPage));
                } else {
                    if (data.podcasts.length < itemsPerPage) {
                        setTotalPages(page);
                    } else {
                        setTotalPages(Math.max(page + 1, totalPages));
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch podcasts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        } else {
            setCurrentPage(totalPages);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else {
            setCurrentPage(1);
        }
    };

    const handlePageClick = (pageIndex: number) => {
        setCurrentPage(pageIndex + 1); // Add 1 because pageIndex is 0-based
    };

    return (
        <div className="mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                You might also like
            </h2>
            <div className="relative">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handlePrevious}
                        className={`bg-[#01aa4f] text-white p-2 rounded-full hover:bg-[#018a3f] transition-all duration-300 hover:cursor-pointer z-10 ${isLoading ? 'opacity-70' : 'opacity-100'}`}
                        disabled={isLoading}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <div className="flex gap-6 overflow-hidden p-10 w-[1100px] justify-start">
                        {isLoading
                            ? Array.from({ length: itemsPerPage }).map(
                                  (_, index) => (
                                      <div
                                          key={`skeleton-${index}`}
                                          className="w-[240px] bg-gradient-to-br flex-shrink-0 from-gray-100 to-gray-150 rounded-xl shadow-md"
                                          style={{ height: '400px' }}
                                      >
                                          <div className="p-2 h-full flex flex-col">
                                              {/* Image placeholder - same aspect ratio as real images */}
                                              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>
                                              <div className="mt-2 text-center flex-grow flex flex-col">
                                                  {/* Title placeholder */}
                                                  <div className="h-6 bg-gray-200 rounded mb-2 mx-auto w-[90%] animate-pulse"></div>
                                                  {/* Date placeholder with icon */}
                                                  <div className="flex items-center justify-start pl-2 gap-2 mb-2">
                                                      <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
                                                      <div className="h-4 bg-gray-200 rounded w-[75%] animate-pulse"></div>
                                                  </div>
                                                  {/* Duration placeholder with icon */}
                                                  <div className="flex items-center justify-start pl-2 gap-2">
                                                      <div className="w-4 h-4 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
                                                      <div className="h-4 bg-gray-200 rounded w-[40%] animate-pulse"></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  ),
                              )
                            : podcasts.map((podcast) => (
                                  <div
                                      key={podcast.podcast_id}
                                      className={`w-[240px] bg-gradient-to-br flex-shrink-0 from-gray-100 to-gray-150 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
                                          currentPodcastId ===
                                          podcast.podcast_id
                                              ? 'ring-4 ring-[#01aa4f]'
                                              : ''
                                      }`}
                                      style={{ height: '400px' }}
                                      onClick={() => onPodcastSelect(podcast)}
                                  >
                                      <div className="p-2 h-full flex flex-col">
                                          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                                              <Image
                                                  src="/images/placeholders/podcast-placeholder.png"
                                                  alt={podcast.title}
                                                  fill
                                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                  className="object-cover"
                                                  priority={false}
                                              />
                                              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                  <button className="bg-[#01aa4f] text-white p-2 rounded-full hover:bg-[#018a3f] transition-colors hover:cursor-pointer">
                                                      <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          className="h-6 w-6"
                                                          viewBox="0 0 20 20"
                                                          fill="currentColor"
                                                      >
                                                          <path
                                                              fillRule="evenodd"
                                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                              clipRule="evenodd"
                                                          />
                                                      </svg>
                                                  </button>
                                              </div>
                                          </div>
                                          <div className="mt-2 text-center">
                                              <h3 className="text-lg font-bold text-[#01aa4f] mb-2 line-clamp-2">
                                                  {podcast.title}
                                              </h3>
                                              <div className="flex items-center justify-start pl-2 gap-2 text-gray-500 text-sm mb-2">
                                                  <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className="h-6 w-6"
                                                      viewBox="0 0 20 20"
                                                      fill="currentColor"
                                                  >
                                                      <path
                                                          fillRule="evenodd"
                                                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                          clipRule="evenodd"
                                                      />
                                                  </svg>
                                                  {(() => {
                                                      // Subtract 7 hours from the publish date
                                                      const date = new Date(
                                                          podcast.publish_date,
                                                      );
                                                      date.setHours(
                                                          date.getHours() - 7,
                                                      );

                                                      return date.toLocaleDateString(
                                                          'en-US',
                                                          {
                                                              month: 'long',
                                                              day: 'numeric',
                                                              year: 'numeric',
                                                          },
                                                      );
                                                  })()}
                                              </div>
                                              <div className="flex items-center justify-start pl-2 gap-2 text-gray-500 text-sm">
                                                  <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className="h-4 w-4"
                                                      viewBox="0 0 20 20"
                                                      fill="currentColor"
                                                  >
                                                      <path
                                                          fillRule="evenodd"
                                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                          clipRule="evenodd"
                                                      />
                                                  </svg>
                                                  {Math.floor(
                                                      getPodcastLength(
                                                          podcast,
                                                      ) / 60,
                                                  )}
                                                  :
                                                  {(
                                                      getPodcastLength(
                                                          podcast,
                                                      ) % 60
                                                  )
                                                      .toString()
                                                      .padStart(2, '0')}{' '}
                                                  min(s)
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className={`bg-[#01aa4f] text-white p-2 rounded-full hover:bg-[#018a3f] transition-all duration-300 hover:cursor-pointer z-10 ${isLoading ? 'opacity-70' : 'opacity-100'}`}
                        disabled={isLoading}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageClick(i)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                currentPage === i + 1
                                    ? 'bg-[#01aa4f] text-white shadow-lg scale-110'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:cursor-pointer'
                            } ${isLoading ? 'opacity-70' : 'opacity-100'}`}
                            disabled={isLoading}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
