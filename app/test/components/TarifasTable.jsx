import { getDayName, getPrecio, getUniqueHorarios, getUniqueDias } from '../data/canchaConfig';

const colorSchemes = {
  yellow: {
    headerBg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
    dot: 'bg-yellow-500',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hover: 'hover:bg-yellow-50/50'
  },
  blue: {
    headerBg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    hover: 'hover:bg-blue-50/50'
  },
  green: {
    headerBg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-800 border-green-200',
    hover: 'hover:bg-green-50/50'
  }
};

export default function TarifasTable({ data, colorScheme = 'yellow' }) {
  if (!data || data.length === 0) {
    return (
      <div className="col-span-8">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">No hay tarifas disponibles</p>
        </div>
      </div>
    );
  }

  const colors = colorSchemes[colorScheme];
  const horarios = getUniqueHorarios(data);
  const dias = getUniqueDias(data);

  return (
    <div className="col-span-8">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${colors.headerBg} border-b border-slate-200`}>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 border-r border-slate-200">
                  Horario
                </th>
                {dias.map(dia => (
                  <th key={dia} className="px-6 py-3 text-center text-sm font-semibold text-slate-900 border-r border-slate-200 last:border-r-0">
                    {getDayName(dia)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horarios.map((hora, index) => (
                <tr key={hora} className={`transition-colors ${colors.hover} ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} border-b border-slate-100 last:border-b-0`}>
                  <td className="px-6 py-3 font-medium text-slate-900 border-r border-slate-200 bg-slate-50">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 ${colors.dot} rounded-full mr-3`}></div>
                      <span className="text-sm">{hora}</span>
                    </div>
                  </td>
                  {dias.map(dia => {
                    const precio = getPrecio(data, hora, dia);
                    return (
                      <td key={`${hora}-${dia}`} className="px-6 py-3 text-center border-r border-slate-200 last:border-r-0">
                        {precio !== '-' ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.badge} border`}>
                            {precio}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}