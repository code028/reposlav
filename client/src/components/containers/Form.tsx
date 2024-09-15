import { Box } from "lucide-react";
import React from "react";

const FormContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={`w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 ${className} bg-secondary-custom  bg-opacity-60 py-8 px-8 rounded shadow-xl`}>
    {/* boja diva iznad bila bg-[#dedede] */}
    <div className="flex flex-row items-center gap-3 pb-5 text-primary-custom">
      <div className="p-2 bg-black dark:bg-white rounded-full">
        <Box size={32} className="text-[#bebebe] dark:text-black" />
      </div>
      <h1 className="hover:text-[#bebebe] font-bold text-[22px] transition select-none">
        Репозиторијум
      </h1>
    </div>
    {children} 
  </div>;
};

export default FormContainer;
