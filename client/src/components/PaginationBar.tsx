import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Prop {
    hasNextPage : boolean,
    hasPrevPage : boolean ,
    page : number ,
   handleNext : () => void ,  
   handlePrev : () => void 
}
const PaginationBar = ({hasNextPage , hasPrevPage , page , handleNext , handlePrev} : Prop ) => {
    
  return (
    <div className="mt-6 flex items-center justify-center gap-4 select-none">
        {hasPrevPage && (
          <button onClick={handlePrev} className="text-lg flex hover:bg-[#6161617f] rounded-xl p-2 items-center cursor-pointer  text-white transition hover:text-gray-300">
             <ChevronLeft />Previous 
          </button>
        )}

        {hasPrevPage && (
          <button
            onClick={handlePrev}
            className="rounded-xl bg-white px-5 py-4 text-sm text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {page - 1}
          </button>
        )}

        <span className="rounded-xl bg-blue-500 px-5 py-4 text-sm text-white">{page}</span>

        {hasNextPage && (
          <button
            onClick={handleNext}
            className="rounded-xl bg-white px-5 py-4 text-sm text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {page + 1}
          </button>
        )}

        {hasNextPage && <button className="text-2xl text-white transition hover:text-gray-300">...</button>}

        {hasNextPage && (
          <button onClick={handleNext} className="text-lg flex hover:bg-[#6161617f] rounded-xl p-2 items-center cursor-pointer  text-white transition hover:text-gray-300">
            Next <ChevronRight/>
          </button>
        )}
      </div>
  )
}

export default PaginationBar
