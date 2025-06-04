import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Globe, List, Monitor, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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
};

type Props = {
  log: LogItem;
};

const EVENT_TYPES = ['LOGIN', 'LOGOUT', 'PAGE_VISIT', 'ERROR', 'WARNING', 'API_CALL'];

const BASE_URL = import.meta.env.VITE_BASE_URL;

function RouteComponent() {
  const [list, setList] = useState<LogItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [eventType, setEventType] = useState<string>(EVENT_TYPES[0]);
  const [metadata, setMetadata] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [userAgent, setUserAgent] = useState<string>('');
  const [isFormError, setIsFormError] = useState<boolean>(false);

  const getUserLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/log`, {
        withCredentials: true,
      });
      setList(response.data.logs);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load logs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormError(false);

    try {
      const response = await axios.post(
        `${BASE_URL}/log`,
        {
          eventType,
          metadata,
          ipAddress,
          userAgent,
        },
        { withCredentials: true }
      );
      console.log('Log submission successful:', response.status);

      setList((prevList) => [
        ...prevList,
        {
          ...response.data.log,
          eventType,
          metadata,
          ipAddress,
          userAgent,
          createdAt: new Date().toISOString(),
        },
      ]);
      setIsOpen(false);
    } catch (err) {
      console.error('Error submitting log:', err);
      setIsFormError(true);
    }

    setEventType(EVENT_TYPES[0]);
    setMetadata('');
    setIpAddress('');
    setUserAgent('');
  };

  useEffect(() => {
    getUserLogs();
  }, []);

  if (error) {
    return <div className="mt-4 text-center text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="pt-4 text-center text-gray-500">Loading logs...</div>;
  }
  // no data found 
  if (list.length === 0) {
    return (
      <div className="relative flex h-full min-h-screen flex-col items-center justify-center gap-5 bg-black pt-10">
        <div className="text-center text-gray-500">
          <p className="mb-4 text-lg text-white">No log entries found. Start by adding one!</p>
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="0 cursor-pointer rounded-lg px-10 py-2 font-semibold text-white shadow-md transition-colors hover:from-blue-600 hover:to-blue-700"
          >
            Add Log
          </button>
        </div>

        {isOpen && (
          <>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ type: 'tween', ease: 'linear', duration: 0.3 }}
              className="absolute top-0 right-0 z-20 h-full w-full overflow-y-auto bg-gray-800/90 p-6 backdrop-blur-md sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <div className="flex justify-end">
                <button
                  className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-700"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <X className="text-white" size={24} />
                </button>
              </div>

              {isFormError && (
                <div className="mx-2 rounded-xl border border-red-300 bg-[#ff4a4abe] py-3 text-center text-red-50">
                  <p>Something went wrong. Please try again.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-300">
                    Event Type
                  </label>
                  <div className="relative">
                    <List className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={20} />
                    <select
                      id="eventType"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-gray-800 text-white">
                          {type.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="metadata" className="block text-sm font-medium text-gray-300">
                    Metadata (JSON)
                  </label>
                  <div className="relative">
                    <FileText className="absolute top-3 left-3 text-gray-500" size={20} />
                    <textarea
                      id="metadata"
                      value={metadata}
                      onChange={(e) => setMetadata(e.target.value)}
                      placeholder='e.g., {"action": "login_success", "user_role": "admin"}'
                      rows={4}
                      className="w-full resize-y rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-300">
                    IP Address
                  </label>
                  <div className="relative">
                    <Globe className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      id="ipAddress"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="e.g., 192.168.1.1"
                      className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="userAgent" className="block text-sm font-medium text-gray-300">
                    User Agent
                  </label>
                  <div className="relative">
                    <Monitor className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="text"
                      id="userAgent"
                      value={userAgent}
                      onChange={(e) => setUserAgent(e.target.value)}
                      placeholder="e.g., Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                      className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                >
                  <Send size={20} />
                  Add
                </button>
              </form>
            </motion.div>

            <div className="absolute top-0 left-0 z-10 h-full w-full bg-[#000000bb]"></div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-screen flex-col items-center gap-5 bg-black to-blue-900 pt-10">
      <div>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="cursor-pointer rounded-lg bg-gradient-to-r from-[#6464ff] to-blue-600 px-10 py-2 font-semibold text-white shadow-md transition-colors hover:from-blue-600 hover:to-blue-700"
        >
          Add Log
        </button>
      </div>
       {/* add form */}
      {isOpen && (
        <>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.3 }}
            className="absolute top-0 right-0 z-20 h-full w-full overflow-y-auto bg-gray-800/90 p-6 backdrop-blur-md sm:w-1/2 md:w-1/3 lg:w-1/4"
          >
            <div className="flex justify-end">
              <button
                className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-700"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <X className="text-white" size={24} />
              </button>
            </div>

            {isFormError && (
              <div className="mx-2 rounded-xl border border-red-300 bg-[#ff4a4abe] py-3 text-center text-red-50">
                <p>Something went wrong. Please try again.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
              <div className="space-y-2">
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-300">
                  Event Type
                </label>
                <div className="relative">
                  <List className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={20} />
                  <select
                    id="eventType"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-gray-800 text-white">
                        {type.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="metadata" className="block text-sm font-medium text-gray-300">
                  Metadata (JSON)
                </label>
                <div className="relative">
                  <FileText className="absolute top-3 left-3 text-gray-500" size={20} />
                  <textarea
                    id="metadata"
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                    placeholder='e.g., {"action": "login_success", "user_role": "admin"}'
                    rows={4}
                    className="w-full resize-y rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-300">
                  IP Address
                </label>
                <div className="relative">
                  <Globe className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    id="ipAddress"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="e.g., 192.168.1.1"
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="userAgent" className="block text-sm font-medium text-gray-300">
                  User Agent
                </label>
                <div className="relative">
                  <Monitor className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    id="userAgent"
                    value={userAgent}
                    onChange={(e) => setUserAgent(e.target.value)}
                    placeholder="e.g., Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                <Send size={20} />
                Add
              </button>
            </form>
          </motion.div>

          <div className="absolute top-0 left-0 z-10 h-full w-full bg-[#000000bb]"></div>
        </>
      )}
      {/* table */}
      <div className="mx-auto w-full max-w-[1200px] py-5 text-center">
        <div className="mx-auto mt-6 max-w-[1300px] overflow-x-auto rounded-xl border bg-white shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Event Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  IP Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  User Agent
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Metadata
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {list.map((log) => (
                <LogCard key={log.id} log={log} />
              ))}
            </tbody>
          </table>
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
    <tr>
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{log.eventType}</td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{log.ipAddress}</td>
      <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500"> {log.userAgent}</td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
        {log.createdAt ? new Date(log.createdAt).toLocaleString() : new Date().toLocaleString()}
      </td>
      <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500"> {formatMetadata(metadata)}</td>
    </tr>
  );
};
