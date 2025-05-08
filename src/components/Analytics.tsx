import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  const summaryStats = [
    {
      title: 'Average Daily Traffic',
      value: '24,500',
      change: '+12%',
      trend: 'up',
      color: 'text-green-500'
    },
    {
      title: 'Peak Hour Traffic',
      value: '3,200',
      change: '+8%',
      trend: 'up',
      color: 'text-green-500'
    },
    {
      title: 'Average Wait Time',
      value: '45s',
      change: '-5%',
      trend: 'down',
      color: 'text-red-500'
    },
    {
      title: 'System Efficiency',
      value: '92%',
      change: '+3%',
      trend: 'up',
      color: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === '24h' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === '7d' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === '30d' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-gray-400 text-sm mb-2">{stat.title}</h3>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <span className={`text-sm ${stat.color}`}>
                  {stat.change} from last period
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Flow Chart */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Traffic Flow Over Time</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300">
                Download Data
              </button>
            </div>
            <div className="h-80 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Chart Coming Soon</p>
            </div>
          </div>

          {/* Green Light Duration Chart */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Green Light Duration</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300">
                Download Data
              </button>
            </div>
            <div className="h-80 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Chart Coming Soon</p>
            </div>
          </div>

          {/* Congestion Levels Chart */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Congestion Levels by Hour</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300">
                Download Data
              </button>
            </div>
            <div className="h-80 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Chart Coming Soon</p>
            </div>
          </div>

          {/* Traffic Patterns Chart */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Traffic Patterns</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300">
                Download Data
              </button>
            </div>
            <div className="h-80 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Chart Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 