import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { FileWithWorkAndStudent, useGetAllWorksQuery } from '../store/api/workSlice';
import { Link } from 'react-router-dom';
import { LucideEye, LucideEdit, LucideTrash, Search, MapPin, Download } from 'lucide-react';

const Archive = () => {
  const [works, setWorks] = useState<FileWithWorkAndStudent[]>([]);
  const { data: workData } = useGetAllWorksQuery();
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (workData) {
      setWorks(workData);
    }
  }, [workData]);

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUniversity(e.target.value);
  };

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFaculty(e.target.value);
  };

  const filteredWorks = works.filter((work) => {
    return (
      (!selectedUniversity || work.work.student.universityName === selectedUniversity) &&
      (!selectedFaculty || work.work.student.facultyName === selectedFaculty) &&
      work.work.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Prikazivanje svih jedinstvenih univerziteta i fakulteta
  const universities = Array.from(new Set(workData?.map((work) => work.work.student.universityName)));
  const faculties = Array.from(new Set(workData?.map((work) => work.work.student.facultyName)));

  // Funkcija za formatiranje veličine fajla u MB
  const formatFileSize = (size: number) => {
    return (size / 1048576).toFixed(2); // Konvertuj iz bajtova u MB i zaokruži na 2 decimale
  };

  const handleDeleteWork = async (workId: number) => {
    const confirmation = window.confirm('Da li ste sigurni da želite da obrišete ovaj rad?');

    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:1389/work/${workId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Rad je uspešno obrisan.');
          // Osveži listu radova ili ukloni obrisani rad iz state-a
          setWorks((prevWorks) => prevWorks.filter((work) => work.work.id !== workId));
        } else {
          alert('Greška prilikom brisanja rada.');
        }
      } catch (error) {
        console.error('Greška prilikom brisanja rada:', error);
        alert('Greška prilikom brisanja rada.');
      }
    }
  };


  return (
    <MainLayout>
      <div className="w-full h-screen min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center bg-secondary-custom overflow-y-scroll">
        <div className="w-full max-w-7xl">
          {/* Naslov i dropdown */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-4 sm:py-6">
            <div className="text-2xl sm:text-3xl font-bold flex items-center gap-3 sm:gap-5 text-center md:text-left">
              {selectedUniversity
                ? universities?.find((uni) => uni === selectedUniversity)
                : 'Сви радови'}
            </div>

            {/* Dropdown za univerzitete i fakultete */}
            <div className="flex gap-3 sm:gap-4 items-center mt-4 md:mt-0">
              <select
                className="border border-gray-300 py-2 px-3 sm:px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-2 transition duration-200 hover:border-black hover:border-opacity-80 max-h-48 overflow-y-auto"
                onChange={handleUniversityChange}
                value={selectedUniversity || ''}
              >
                <option value="">Изаберите универзитет</option>
                {universities?.map((uni, idx) => (
                  <option key={idx} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>

              <select
                className="border border-gray-300 py-2 px-3 sm:px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-2 transition duration-200 hover:border-black hover:border-opacity-80 max-h-48 overflow-y-auto"
                onChange={handleFacultyChange}
                value={selectedFaculty || ''}
              >
                <option value="">Изаберите факултет</option>
                {faculties?.map((fac, idx) => (
                  <option key={idx} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pretraga radova */}
          <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold">Радови</h3>
              <div className="relative w-full sm:w-1/3 mt-4 sm:mt-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Претражите по називу"
                  className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:border-black focus:border-2 transition duration-200 hover:border-black hover:border-opacity-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Kartice sa radovima */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredWorks.length > 0 ? (
                filteredWorks.map((work) => {
                  return (
                    <div
                      key={work.id}
                      className="flex flex-col justify-between bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg hover:border-black hover:border-opacity-80 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg sm:text-xl font-semibold leading-tight">{work.work.name}</h4>
                        </div>

                        {/* Prikaz naziva univerziteta */}
                        <div className="flex flex-col mt-2">
                          <div className="text-gray-800 font-medium text-sm mb-1">{work.work.student.universityName}</div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 text-red-500 mr-1" />
                            {work.work.student.facultyName}
                          </div>
                        </div>

                        {/* Prikaz veličine fajla */}
                        <div className="mt-2 text-gray-600 text-sm">
                          <p>Величина фајла: {formatFileSize(work.size)} MB</p>
                        </div>
                      </div>

                      {/* Akciona dugmad sa ikonama */}
                      <div className="flex items-center justify-evenly gap-3 mt-3">
                        <Link
                          to={`/works/${work.id}`}
                          className="bg-black bg-opacity-80 text-white p-2 rounded-full transition hover:rotate-12 duration-200"
                        >
                          <LucideEye className="w-5 h-5" />
                        </Link>

                        <Link
                          to={`/works/${work.id}/edit`}
                          className="bg-black bg-opacity-80 text-white p-2 rounded-full transition hover:rotate-12 duration-200"
                        >
                          <LucideEdit className="w-5 h-5" />
                        </Link>
                        {/* Dodavanje dugmeta za preuzimanje */}
                        <a
                          href={`http://localhost:1389/download/2024/${work.work.student.universityId}/${work.work.student.facultyId}/${work.work.id}/${work.name}`}
                          className="bg-black bg-opacity-80 text-white p-2 rounded-full transition hover:rotate-12 duration-200"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">Нема радова</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Archive;
