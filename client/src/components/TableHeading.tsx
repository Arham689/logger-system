import { TableHead, TableRow } from '@/components/ui/table';

export const TableHeading = () => (
  <TableRow>
    <TableHead>Event Type</TableHead>
    <TableHead>IP Address</TableHead>
    <TableHead>User Agent</TableHead>
    <TableHead>Created At</TableHead>
    <TableHead>Metadata</TableHead>
    <TableHead>Tags</TableHead>
  </TableRow>
);
