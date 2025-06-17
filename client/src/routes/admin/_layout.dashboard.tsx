import { MultiSelectInput } from '@/components/EventForm';
import EnhancedLogTableShimmer from '@/components/LogTableShimmer';
import PaginationBar from '@/components/PaginationBar';
import { SimpleDropdownFilter } from '@/components/SimpleDropdownFilter';
import { Calendar22 } from '@/components/ui/Datepicker';
import { TAG_OPTIONS } from '@/utils/constants';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const Route = createFileRoute('/admin/_layout/dashboard')({
  component: RouteComponent,
});

type LogItem = {
  id?: number;
  createdAt?: string;
  eventType: string;
  ipAddress: string;
  metadata: string;
  userAgent: string;
  userName: string;
};

type Props = {
  log: LogItem;
};

function RouteComponent() {
  const [list, setList] = useState<LogItem[]>([]);

  const [error, setError] = useState<string | null>(null);
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [filterItems, setFilterItems] = useState(list);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const filters = ['LOGIN', 'LOGOUT', 'PAGE_VISIT', 'ERROR', 'WARNING', 'API_CALL'];
  const getdata = async (currentPage = 1) => {
    try {
      const tagsParam = selectedTags.map((tag) => `tags=${encodeURIComponent(tag)}`).join('&');
      const response = await axios.get(
        `${BASE_URL}/data?page=${currentPage}&limit=${limit}&event=${selectedFilter}&${tagsParam}&date=${selectedDate}`,
        { withCredentials: true }
      );

      const data = response.data;

      console.log(data, 'responst form the get use logs');
      setList(data.logs);
      setFilterItems(data.logs);
      setHasNextPage(data.hasNextPage);
      setHasPrevPage(data.hasPrevPage);
      setPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to load logs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getdata();
  }, [selectedFilter, selectedTags, selectedDate]);

  const handleNext = () => {
    if (hasNextPage) getdata(page + 1);
  };

  const handlePrev = () => {
    if (hasPrevPage) getdata(page - 1);
  };

  const socket = io('http://localhost:3000', {
    path: '/ws',
    transports: ['websocket'], // Explicitly use websocket for faster connection
  });

  socket.on('log_created', (data) => {
    setList([...list, data]);
  });

  if (error) {
    return <div className="mt-4 text-center text-red-500">{error}</div>;
  }

  if (loading) {
    return <EnhancedLogTableShimmer />;
  }

  return (
    <div className="h-screen w-full bg-black text-white">
      <div className="mx-auto w-full max-w-[1200px] py-5 text-center">
        <div className="flex w-full max-w-4xl flex-wrap items-center justify-center gap-3 sm:gap-5">
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

          <Calendar22 setSelectedDate={setSelectedDate} />
        </div>

        <div className="mx-auto mt-6 max-w-[1300px] overflow-x-auto rounded-xl border bg-white shadow-md">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  User Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Metadata
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filterItems.map((log, i) => (
                <LogCard key={i} log={log} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex w-full justify-center pb-10">
          <PaginationBar
            handleNext={handleNext}
            handlePrev={handlePrev}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            page={page}
          />
        </div>
      </div>
    </div>
  );
}

const LogCard: React.FC<Props> = ({ log }) => {
  let metadata: Record<string, any> = {};

  try {
    metadata = JSON.parse(log.metadata);
  } catch (e) {
    metadata = { error: 'Invalid metadata format' };
  }

  const formatMetadata = (data: Record<string, any>): string => {
    if (data.error) {
      return data.error;
    }
    return Object.entries(data)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(', ');
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-gray-900">{log.eventType}</td>
      <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-500">{log.ipAddress}</td>
      <td className="max-w-[200px] truncate px-6 py-4 text-left text-sm text-gray-500">{log.userAgent}</td>
      <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-500">
        {log.createdAt && new Date(log.createdAt).toLocaleString()}
      </td>
      <td className="max-w-[240px] truncate px-6 py-4 text-left text-sm text-gray-500">{formatMetadata(metadata)}</td>
      <td className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-gray-700">
        {log.userName || 'Unknown'}
      </td>
    </tr>
  );
};
