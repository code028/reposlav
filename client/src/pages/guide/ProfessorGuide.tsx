import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';

const ProfessorGuide = () => {
  return (
    <MainLayout>
      <div className="w-full h-screen p-6 flex flex-col items-center justify-start bg-secondary-custom overflow-y-scroll">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Упутство за додaвање завршног рада</h1>

          <div className="flex flex-col gap-6">
            {/* Korak 1 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">1. Информације о професору</h2>
              <p className="text-gray-600">- Име професора: <span className="font-medium">Аутоматски попуњено.</span></p>
              <p className="text-gray-600">- Е-пошта професора: <span className="font-medium">Аутоматски попуњено.</span></p>
            </div>

            {/* Korak 2 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">2. Избор студента</h2>
              <p className="text-gray-600">- Изаберите студента из падајућег менија: <span className="font-medium">Прво име, факултет и е-пошта студента су видљиви.</span></p>
            </div>

            {/* Korak 3 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">3. Унос броја индекса студента</h2>
              <p className="text-gray-600">- Унесите број индекса студента у одговарајуће поље.</p>
            </div>

            {/* Korak 4 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">4. Избор типа рада</h2>
              <p className="text-gray-600">- Изаберите тип рада (дипломски рад или мастер рад) из падајућег менија.</p>
            </div>

            {/* Korak 5 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">5. Наслов теме рада</h2>
              <p className="text-gray-600">- Унесите наслов теме завршног рада у текстуално поље.</p>
            </div>

            {/* Korak 6 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">6. Оцена рада</h2>
              <p className="text-gray-600">- Изаберите оцену рада са листе (од 6 до 10).</p>
            </div>

            {/* Korak 7 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">7. Додавање фајлова</h2>
              <p className="text-gray-600">- Додајте фајлове са завршним радом. Можете отказати или обрисати додате фајлове.</p>
            </div>

            {/* Korak 8 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">8. Потврда</h2>
              <p className="text-gray-600">- Након попуњавања свих информација, кликните на дугме <span className="font-medium">"Додај рад"</span> да бисте потврдили и додали рад.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfessorGuide;
