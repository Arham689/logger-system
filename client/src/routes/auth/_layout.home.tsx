import { createFileRoute, Link } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import EventForm, { MultiSelectInput } from '../../components/EventForm';
import EnhancedLogTableShimmer from '../../components/LogTableShimmer';

import { LogCard } from '../../components/LogCard';
import PaginationBar from '../../components/PaginationBar';
import { SimpleDropdownFilter } from '../../components/SimpleDropdownFilter';
import { TableHeading } from '../../components/TableHeading';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Route = createFileRoute('/auth/_layout/home')({
  component: RouteComponent,
});

type LogItem = {
  id?: number;
  createdAt?: string;
  eventType: string;
  ipAddress: string;
  metadata: string;
  userAgent: string;
  tag: string[];
};

const TAG_OPTIONS = [
  'first_log',
  'recent',
  'favorite',
  'useful',
  'repeating',
  'error',
  'warning',
  'info',
  'debug',
  'critical',
  'archived',
  'manual',
  'auto_generated',
];

function RouteComponent() {
  const [list, setList] = useState<LogItem[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormError, setIsFormError] = useState<boolean>(false);

  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [filterItems, setFilterItems] = useState(list);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(2);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const filters = ['LOGIN', 'LOGOUT', 'PAGE_VISIT', 'ERROR', 'WARNING', 'API_CALL'];
  const socket = io('http://localhost:3000', {
    path: '/ws',
    transports: ['websocket'],
  });

  socket.on('hello', (s) => {
    console.log(s.id, 'world');
  });

  socket.send('ehlo');
  const handleNext = () => {
    if (hasNextPage) getUserLogs(page + 1);
  };

  const handlePrev = () => {
    if (hasPrevPage) getUserLogs(page - 1);
  };

  const getUserLogs = async (currentPage = 1) => {
    try {
      setLoading(true);
      const tagsParam = selectedTags.map((tag) => `tags=${encodeURIComponent(tag)}`).join('&');
      const response = await axios.get(
        `${BASE_URL}/log?page=${currentPage}&limit=${limit}&event=${selectedFilter}&${tagsParam}&date=${selectedDate}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log(data, 'responst form the get use logs');
      setList(data.logs);
      setFilterItems(data.logs);
      setHasNextPage(data.hasNextPage);
      setHasPrevPage(data.hasPrevPage);
      setPage(data.currentPage);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load logs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async ({
    eventType,
    metadata,
    ipAddress,
    userAgent,
    tag,
  }: {
    eventType: string;
    metadata: string;
    ipAddress: string;
    userAgent: string;
    tag: string[];
  }) => {
    setIsFormError(false);
    try {
      const response = await axios.post(
        `${BASE_URL}/log?page=1&limit=10`,
        {
          eventType,
          metadata,
          ipAddress,
          userAgent,
          tag: tag,
        },
        { withCredentials: true }
      );
      console.log('Log submission successful:', response.status);

      setList((prevList) => [
        {
          ...response.data.log,
          eventType,
          metadata,
          ipAddress,
          userAgent,
          tag: tag,
          createdAt: new Date().toISOString(),
        },
        ...prevList,
      ]);

      setFilterItems((prevList) => [
        ...prevList,
        {
          ...response.data.log,
          eventType,
          metadata,
          ipAddress,
          userAgent,
          tag: tag,
          createdAt: new Date().toISOString(),
        },
      ]);

      setIsOpen(false);
    } catch (err) {
      console.error('Error submitting log:', err);
      setIsFormError(true);
    }
  };

  useEffect(() => {
    getUserLogs();
  }, [selectedFilter, selectedTags, selectedDate]);

  useEffect(() => {
    getUserLogs();
  }, []);

  if (error) {
    return <div className="mt-4 text-center text-red-500">{error}</div>;
  }

  if (loading) {
    return <EnhancedLogTableShimmer />;
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden flex flex-col items-center gap-5 bg-black pt-10 px-4">
  
  <div className='flex gap-5 flex-wrap justify-center'>
    <div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer rounded-lg bg-gradient-to-r from-[#4683ff] to-blue-600 px-6 sm:px-10 py-2 font-semibold text-white shadow-md transition-colors hover:from-blue-600 hover:to-blue-700"
      >
        Add Log
      </button>
    </div>
    <Link to="/auth/generateKey">
      <div>
        <button className="cursor-pointer rounded-lg bg-gradient-to-r from-[#4683ff] to-blue-600 px-6 sm:px-10 py-2 font-semibold text-white shadow-md transition-colors hover:from-blue-600 hover:to-blue-700">
          Generate Api Key
        </button>
      </div>
    </Link>
  </div>

  {/* ALL FILTERS */}
  <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap w-full max-w-4xl">
    <div className="min-w-0 flex-shrink-0">
      <SimpleDropdownFilter 
        filters={filters} 
        selectedFilter={selectedFilter} 
        setSelectedFilter={setSelectedFilter} 
      />
    </div>

    <div className="min-w-0 flex-shrink-0">
      <MultiSelectInput
        label="Tags"
        options={TAG_OPTIONS}
        selectedOptions={selectedTags}
        onChange={setSelectedTags}
      />
    </div>

    <div className="flex flex-col items-start gap-2 min-w-0 flex-shrink-0">
      <input
        type="date"
        onChange={(e) => {
          const val = e.target.value;
          setSelectedDate(val ? new Date(val) : null);
        }}
        className="cursor-pointer rounded-xl border border-gray-400 bg-white p-2 text-black w-full min-w-[140px]"
      />

      {selectedDate && (
        <p className="text-sm text-[gray] whitespace-nowrap">
          Selected date: <span className="font-semibold">{selectedDate.toLocaleDateString('en-CA')}</span>
        </p>
      )}
    </div>
  </div>

  {/* add form */}
  {isOpen && <EventForm isOpen={isOpen} setIsOpen={setIsOpen} formError={isFormError} onSubmit={handleSubmit} />}
  
  {/* table */}
  <div className="w-full max-w-[1480px] py-5 text-center px-4">
    <div className="mt-6 overflow-x-auto rounded-xl border bg-white shadow-md">
      <table className="w-full divide-y divide-gray-200 min-w-[800px]">
        <thead className="bg-gray-50">
          <TableHeading />
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filterItems.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* pagination */}
  <div className="w-full flex justify-center pb-10">
    <PaginationBar
      handleNext={handleNext}
      handlePrev={handlePrev}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      page={page}
    />
  </div>
</div>
  );
}
