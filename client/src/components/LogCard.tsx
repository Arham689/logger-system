type LogItem = {
  id?: number;
  createdAt?: string;
  eventType: string;
  ipAddress: string;
  metadata: string;
  userAgent: string;
  tag: string[];
};

type Props = {
  log: LogItem;
};
export const LogCard: React.FC<Props> = ({ log }) => {
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
      <td className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-gray-900">{log.eventType}</td>
      <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-500">{log.ipAddress}</td>
      <td className="max-w-xs truncate px-6 py-4 text-left text-sm text-gray-500"> {log.userAgent}</td>
      <td className="px-6 py-4 text-left text-sm whitespace-nowrap text-gray-500">
        {log.createdAt ? new Date(log.createdAt).toLocaleString() : new Date().toLocaleString()}
      </td>
      <td className="max-w-xs truncate px-6 py-4 text-left text-sm text-gray-500"> {formatMetadata(metadata)}</td>
      <td className="max-w-xs truncate px-6 py-4 text-left text-sm text-gray-500">
        <td className="max-w-xs truncate px-6 py-4 text-left text-sm text-gray-500">
          {log.tag?.map((t) => t).join(', ')}
        </td>
      </td>
    </tr>
  );
};