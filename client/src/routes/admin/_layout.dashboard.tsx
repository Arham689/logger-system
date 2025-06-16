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

// const data = [
//   {
//     logId: 17,
//     eventType: 'ERROR',
//     metadata: '{"error" : "something went worg \n"}',
//     ipAddress: '192.168.11.78',
//     userAgent: 'mac m1 air',
//     createdAt: '2025-06-05T08:01:23.224Z',
//     userName: 'test3',
//   },
//   {
//     logId: 16,
//     eventType: 'PAGE_VISIT',
//     metadata: '{"test" : "300"}',
//     ipAddress: '132.21.0.0',
//     userAgent: 'mobile',
//     createdAt: '2025-06-05T08:00:33.150Z',
//     userName: 'test3',
//   },
//   {
//     logId: 13,
//     eventType: 'ERROR',
//     metadata: '{"status" : "401"}',
//     ipAddress: '23.231.12.12',
//     userAgent: 'Fire Fox',
//     createdAt: '2025-06-05T06:56:03.691Z',
//     userName: 'test1',
//   },
//   {
//     logId: 12,
//     eventType: 'PAGE_VISIT',
//     metadata: '{"foo" : "bar"}',
//     ipAddress: '0.0.0.0',
//     userAgent: 'mac m1 air',
//     createdAt: '2025-06-04T15:38:59.427Z',
//     userName: 'test2',
//   },
//   {
//     logId: 11,
//     eventType: 'WARNING',
//     metadata: '{"payment error" : "limit excided"}',
//     ipAddress: '192.168.11.78',
//     userAgent: 'mac m1 air',
//     createdAt: '2025-06-04T15:30:15.602Z',
//     userName: 'test1',
//   },
//   {
//     logId: 10,
//     eventType: 'LOGIN',
//     metadata: '{"log in " : "hello workd "}',
//     ipAddress: '111.134.96.23',
//     userAgent: 'mac m1 air',
//     createdAt: '2025-06-04T15:29:39.245Z',
//     userName: 'test1',
//   },
//   {
//     logId: 9,
//     eventType: 'API_CALL',
//     metadata: '{"api called" : "create log "}',
//     ipAddress: '23.231.12.34',
//     userAgent: 'chrome',
//     createdAt: '2025-06-04T15:20:04.392Z',
//     userName: 'test1',
//   },
//   {
//     logId: 8,
//     eventType: 'LOGOUT',
//     metadata: '{"logout"  : "bye "}',
//     ipAddress: '132.21.0.0',
//     userAgent: 'mobile',
//     createdAt: '2025-06-04T15:18:41.849Z',
//     userName: 'test1',
//   },
//   {
//     logId: 7,
//     eventType: 'ERROR',
//     metadata: '{"error" : "somting went worng "}',
//     ipAddress: '192.168.11.78',
//     userAgent: 'saffari',
//     createdAt: '2025-06-04T15:16:09.257Z',
//     userName: 'test1',
//   },
//   {
//     logId: 6,
//     eventType: 'PAGE_VISIT',
//     metadata: '{"success ": "false" }',
//     ipAddress: '0.0.0.0',
//     userAgent: 'moblie',
//     createdAt: '2025-06-04T15:07:13.362Z',
//     userName: 'test1',
//   },
//   {
//     logId: 5,
//     eventType: 'LOGOUT',
//     metadata: '{"success ":"false"}',
//     ipAddress: '111.11.111.11',
//     userAgent: 'Fire Fox',
//     createdAt: '2025-06-03T13:37:07.186Z',
//     userName: 'test2',
//   },
//   {
//     logId: 4,
//     eventType: 'PAGE_VISIT',
//     metadata: '{"action" : "warning"}',
//     ipAddress: '23.231.12.12',
//     userAgent: 'mobile',
//     createdAt: '2025-06-03T13:31:56.230Z',
//     userName: 'test2',
//   },
//   {
//     logId: 3,
//     eventType: 'ERROR',
//     metadata: '{"action":"user login","success":true}',
//     ipAddress: '192.168.1.100',
//     userAgent: 'arc/5.0 ',
//     createdAt: '2025-06-03T05:08:08.378Z',
//     userName: 'test2',
//   },
//   {
//     logId: 2,
//     eventType: 'PAGE_VISIT',
//     metadata: '{"action":"user login","success":true}',
//     ipAddress: '192.168.1.100',
//     userAgent: 'firefox/5.0 ',
//     createdAt: '2025-06-03T05:04:58.825Z',
//     userName: 'test2',
//   },
//   {
//     logId: 1,
//     eventType: 'LOGIN',
//     metadata: '{"action":"user login","success":true}',
//     ipAddress: '192.168.1.100',
//     userAgent: 'Mozilla/5.0 ',
//     createdAt: '2025-06-03T04:34:26.634Z',
//     userName: 'test1',
//   },
// ];

function RouteComponent() {
  const [list, setList] = useState<LogItem[]>([]);
  const getdata = async () => {
    const response = await axios.get(`${BASE_URL}/data`, { withCredentials: true });
    console.log(response.data.logs)
    setList(response.data.logs)
  };
  useEffect(() => {
    getdata()
  }, []);

  const socket = io('http://localhost:3000', {
    path: '/ws',
    transports: ['websocket'], // Explicitly use websocket for faster connection
  });

  socket.on('log_created' , (data)=>{
    
    setList([...list , data ])
  })

  return (
    <div className="h-screen w-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[1200px] py-5 text-center">
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
              {list.map((log, i) => (
                <LogCard key={i} log={log} />
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
