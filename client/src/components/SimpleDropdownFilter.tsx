
interface SimpleDropdownFilterProps {
  filters: string[];
  selectedFilter: string[];
  setSelectedFilter: (filters: string[]) => void;
}

export  const SimpleDropdownFilter: React.FC<SimpleDropdownFilterProps> = ({ filters, selectedFilter, setSelectedFilter }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value ? [e.target.value] : []);
  };

  return (
    <select
      value={selectedFilter[0] || ''}
      onChange={handleChange}
      className="cursor-pointer rounded-xl border border-gray-400 bg-white p-2 text-black"
    >
      <option value="">All Categories</option>
      {filters.map((filter, idx) => (
        <option key={idx} value={filter}>
          {filter}
        </option>
      ))}
    </select>
  );
};
