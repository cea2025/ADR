import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChartData {
  year: number;
  return: number;
  cumulative: number;
}

interface MobileChartProps {
  data: ChartData[];
  className?: string;
}

const MobileChart: React.FC<MobileChartProps> = ({ data, className = '' }) => {
  const [activeChart, setActiveChart] = useState<'annual' | 'cumulative'>('annual');

  return (
    <div className={className}>
      {/* Chart Selector Tabs - Mobile Only */}
      <div className="md:hidden mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeChart === 'annual' 
                ? 'bg-white text-adr-brown shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveChart('annual')}
          >
            תשואה שנתית
          </button>
          <button 
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeChart === 'cumulative' 
                ? 'bg-white text-adr-brown shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveChart('cumulative')}
          >
            תשואה מצטברת
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }} 
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Return']}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Bar 
              dataKey={activeChart === 'annual' ? 'return' : 'cumulative'} 
              fill="#8B5A3C"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend - Desktop Only */}
      <div className="hidden md:block text-center mt-4">
        <div className="flex items-center justify-center space-x-6 space-x-reverse">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-4 h-4 bg-adr-brown rounded"></div>
            <span className="text-sm text-gray-600">תשואה שנתית</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-4 h-4 bg-adr-gold rounded"></div>
            <span className="text-sm text-gray-600">תשואה מצטברת</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileChart;
