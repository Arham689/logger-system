import { TAG_OPTIONS } from '@/utils/constants';
import { motion } from 'framer-motion';
import { ChevronDown, FileText, Globe, List, Monitor, Send, X } from 'lucide-react'; // Assuming you're using Lucide icons
import React, { useEffect, useRef, useState } from 'react';

const EVENT_TYPES = ['LOGIN', 'LOGOUT', 'PAGE_VISIT', 'ERROR', 'WARNING', 'API_CALL'];

type MultiSelectProps = {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  className?: string;
};

// Defines the shape of the form's data on submission.
type FormData = {
  eventType: string;
  metadata: string;
  ipAddress: string;
  userAgent: string;
  tag: string[];
};

// Defines the props for the main event form component.
type EventFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: FormData) => void;
  formError?: boolean;
};

const EventForm: React.FC<EventFormProps> = ({ isOpen, setIsOpen, onSubmit, formError }) => {
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [metadata, setMetadata] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const resetForm = () => {
    setEventType(EVENT_TYPES[0]);
    setMetadata('');
    setIpAddress('');
    setUserAgent('');
    setSelectedTags([]);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('selected tags from handl submit ', selectedTags);
    onSubmit({ eventType, metadata, ipAddress, userAgent, tag: selectedTags });
    resetForm();
  };

  if (!isOpen) return null;

  return (
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

        {formError && (
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
          <label className="mb-2 block text-sm font-medium text-gray-300">TAGS</label>
          <MultiSelectInput
            label="Tags"
            options={TAG_OPTIONS}
            selectedOptions={selectedTags}
            onChange={setSelectedTags}
          />

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
  );
};

export default EventForm;

export const MultiSelectInput: React.FC<MultiSelectProps> = ({
  options,
  selectedOptions,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().replace(/_/g, ' ').includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option: string) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((tag) => tag !== option)
      : [...selectedOptions, option];
    onChange(newSelection);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedOptions.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={`w-full ${className} `}>
      <div className="relative" ref={dropdownRef}>
        <div
          className={`min-h-[48px] w-full cursor-pointer rounded-lg border ${
            isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-600'
          } flex flex-wrap items-center gap-2 bg-gray-700/50 p-2 text-white transition-colors`}
          onClick={() => setIsOpen(!isOpen)}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedOptions.length === 0 && <span className="ml-1 text-gray-400">Choose tags...</span>}
          {selectedOptions.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-2 py-1 text-sm text-white"
            >
              {tag.replace(/_/g, ' ')}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="rounded-full p-0.5 transition-colors hover:bg-blue-700"
                aria-label={`Remove ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <div className="min-w-[20px] flex-1"></div>
          <ChevronDown
            size={20}
            className={`mr-1 text-gray-400 transition-transform ${isOpen ? 'rotate-180 transform' : ''}`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-20 mt-1 max-h-60 w-full overflow-hidden rounded-lg border border-gray-600 bg-gray-800 shadow-lg">
            <div className="border-b border-gray-600 p-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border-none bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                aria-label="Search for tags"
              />
            </div>
            <ul className="no-scrollbar max-h-40 overflow-y-auto" role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`flex cursor-pointer items-center justify-between px-3 py-2 transition-colors hover:bg-gray-700 ${
                      selectedOptions.includes(option) ? 'bg-gray-700 text-blue-400' : 'text-white'
                    }`}
                    role="option"
                    aria-selected={selectedOptions.includes(option)}
                  >
                    <span>{option.replace(/_/g, ' ')}</span>
                    {selectedOptions.includes(option) && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-blue-500">
                        <div className="h-2 w-2 rounded-sm bg-white"></div>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-gray-400">No tags found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
