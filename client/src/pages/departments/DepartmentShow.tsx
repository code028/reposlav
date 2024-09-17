// import { ChevronRight, Edit, Eye, GraduationCap, Notebook, Plus, Search } from 'lucide-react'
// import MainLayout from '../../components/layouts/MainLayout'
// import { Link, useParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'

// const DepartmentShow = () => {

//   const [data, setData] = useState<GetFacById>()
//   const [searchTerm, setSearchTerm] = useState('');

//   const {id: uniId,id2: facId} = useParams();

//   const {data: responseData, isLoading: facLoading} = useGetFacByIdQuery(facId!);

//   useEffect(() => {
//     if(responseData){ 
//       setData(responseData);
//     }
//   }, [responseData]);
//   // @ts-ignore
//   const filteredDepartments = data?.departments?.filter((department) =>
//     department.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <MainLayout>
//       <div className="w-full h-screen min-h-screen bg-secondary-custom p-6 flex flex-col items-center overflow-y-scroll">
//         <div className="w-full max-w-7xl">
//           {/* Breadcrumb Navigacija */}
//           <nav className="text-sm font-medium text-gray-500 mb-6">
//             <ul className="flex space-x-2 items-center">
//               <li>
//                 <Link to="/universities" className="text-gray-700 hover:underline">
//                   Универзитети
//                 </Link>
//               </li>
//               <li>
//                 <ChevronRight className="w-4 h-4 text-gray-400" />
//               </li>
//               <li> 
//                 <Link to={"/uni/"+`${data?.university.id}`} className="text-gray-700 hover:underline">
//                   {data?.university.name}
//                 </Link>
//               </li>
//               <li>
//                 <ChevronRight className="w-4 h-4 text-gray-400" />
//               </li>
//               <li> 
//                 <Link to={"/uni/"+`${data?.university.id}`} className="text-gray-700 hover:underline">
//                   {data?.name}
//                 </Link>
//               </li>
//               <li>
//                 <ChevronRight className="w-4 h-4 text-gray-400" />
//               </li>
//               <li className=" text-blue-600 hover:underline">
//                 {data?.name}
//               </li>
//             </ul>
//           </nav>
//           {/* Naslov i pretrazivanje */}
//           <div className="w-full flex flex-col md:flex-row justify-between items-center py-6">
//             <div className="text-3xl font-bold flex items-center gap-5 text-center md:text-left mb-4 md:mb-0">
//               <GraduationCap className="w-8 h-8 text-blue-600" />
//               {data?.name}
//             </div>
//             <div className="relative w-full md:w-96">
//               {/* Ikona pretrage */}
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="w-5 h-5 text-gray-500" />
//               </div>
//               {/* Input za pretragu */}
//               <input
//                 type="text"
//                 placeholder="Претражите универзитете"
//                 className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className='w-full flex justify-end'>
//             <Link to={`/uni/${uniId}/fac/${facId}/dep/add`} className="flex items-center px-5 py-3 bg-black bg-opacity-80 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300">
//               <Plus className="w-6 h-6 mr-2" />
//               Додај Одсек
//             </Link>
//           </div>

//           {/* Kartice sa odsecima */}
//           <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
//             {facLoading ? (
//               <div className="col-span-full flex justify-center items-center text-lg font-semibold">Loading...</div>
//             ) : filteredDepartments && filteredDepartments.length > 0 ? (
//               filteredDepartments.map((dep) => (
//                 <div
//                   key={dep.id}
//                   className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 hover:shadow-2xl transition duration-300 "
//                 >
//                   {/* Naslov odseka */}
//                   <div className="flex items-center gap-2 text-xl font-semibold">
//                     <Notebook  className="w-6 h-6 text-blue-600" />
//                     {dep.name}
//                   </div>
//                   <div className='w-full flex gap-3 justify-center items-center'>
//                     {/* Dugme za detalje */}
//                     <Link to={`/uni/${uniId}/fac/${facId}/dep/${dep.id}`} className="w-1/2 flex justify-center items-center mt-auto bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
//                       <Eye />
//                     </Link>
//                     {/* Dugme za edit */}
//                     <Link to={`/uni/${uniId}/fac/${facId}/dep/${dep.id}/edit`} className="w-1/2 flex justify-center items-center mt-auto bg-black bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-opacity-100 transition duration-200">
//                       <Edit />
//                     </Link>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="flex flex-1 justify-center items-center col-span-full text-center text-gray-500">Тражени предмет не постоји</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   )
// }

// export default DepartmentShow


import React from 'react'

const DepartmentShow = () => {
  return (
    <div>DepartmentShow mora da se naprave predmeti prvo</div>
  )
}

export default DepartmentShow