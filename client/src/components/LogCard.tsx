
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";

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
    metadata = { error: "Invalid metadata format" };
  }

  const formatMetadata = (data: Record<string, any>): string => {
    if (data.error) return data.error;
    return Object.entries(data)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(", ");
  };

  return (
    <TableRow className="text-black text-left">
      <TableCell className="py-4">{log.eventType}</TableCell>
      <TableCell>{log.ipAddress}</TableCell>
      <TableCell className="max-w-xs truncate">{log.userAgent}</TableCell>
      <TableCell>
        {log.createdAt
          ? new Date(log.createdAt).toLocaleString()
          : new Date().toLocaleString()}
      </TableCell>
      <TableCell className="max-w-xs truncate">{formatMetadata(metadata)}</TableCell>
      <TableCell className="max-w-xs truncate">{log.tag?.join(", ")}</TableCell>
    </TableRow>
  );
};
