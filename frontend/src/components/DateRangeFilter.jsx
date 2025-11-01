import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const DateRangeFilter = ({ selectedRange, onRangeChange, customStartDate, customEndDate, onCustomDateChange }) => {
  const presetRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'last7days', label: 'Last 7 Days' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">Date Range</h3>
      </div>

      {/* Preset Range Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presetRanges.map((range) => (
          <motion.button
            key={range.id}
            onClick={() => onRangeChange(range.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRange === range.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {range.label}
          </motion.button>
        ))}
      </div>

      {/* Custom Date Inputs */}
      {selectedRange === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomDateChange('start', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomDateChange('end', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DateRangeFilter;
