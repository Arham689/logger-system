import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Prop {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  page: number;
  handleNext: () => void;
  handlePrev: () => void;
}

const PaginationBar = ({ hasNextPage, hasPrevPage, page, handleNext, handlePrev }: Prop) => {
  return (
    <div className="mt-6 flex items-center justify-center">
      <Pagination>
        <PaginationContent className="gap-2">
          {hasPrevPage && (
            <>
              <PaginationItem>
                <PaginationPrevious className="cursor-pointer" onClick={handlePrev}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </PaginationPrevious>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink onClick={handlePrev} className="cursor-pointer">
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationLink isActive className="bg-blue border border-[black] text-white">
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <>
              <PaginationItem>
                <PaginationLink onClick={handleNext} className="cursor-pointer">
                  {page + 1}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext className="cursor-pointer" onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </PaginationNext>
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationBar;
