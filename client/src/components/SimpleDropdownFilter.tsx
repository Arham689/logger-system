import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SimpleDropdownFilterProps {
  filters: string[];
  selectedFilter: string[];
  setSelectedFilter: (filters: string[]) => void;
}

export const SimpleDropdownFilter: React.FC<SimpleDropdownFilterProps> = ({
  filters,
  selectedFilter,
  setSelectedFilter,
}) => {
  const handleChange = (value: string) => {
    if (value === 'all') {
      setSelectedFilter([]);
    } else {
      setSelectedFilter([value]);
    }
  };

  return (
    <Select value={selectedFilter[0] || 'all'} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Dates" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Events</SelectItem>
        {filters.map((filter, idx) => (
          <SelectItem key={idx} value={filter}>
            {filter}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
