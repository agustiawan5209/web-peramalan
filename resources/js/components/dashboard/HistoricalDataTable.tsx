import { motion } from 'framer-motion'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface HarvestData {
  id: number
  bulan: string
  tahun: number
  total_panen: string
  jenisRumputLaut: string[]
}

const HarvestDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof HarvestData; direction: 'asc' | 'desc' } | null>(null)

  // Data contoh - nanti diganti dengan data dari Laravel
  const data: HarvestData[] = [
    { id: 1, bulan: 'Januari', tahun: 2024, total_panen: '125 kg', jenisRumputLaut: ['Eucheuma Cottonii'] },
    { id: 2, bulan: 'Februari', tahun: 2024, total_panen: '98 kg', jenisRumputLaut: ['Gracilaria'] },
    { id: 3, bulan: 'Maret', tahun: 2024, total_panen: '145 kg', jenisRumputLaut: ['Eucheuma Cottonii', 'Gracilaria'] },
    { id: 4, bulan: 'April', tahun: 2024, total_panen: '112 kg', jenisRumputLaut: ['Eucheuma Cottonii'] },
    { id: 5, bulan: 'Mei', tahun: 2024, total_panen: '156 kg', jenisRumputLaut: ['Gracilaria'] },
  ]

  const sortedData = [...data]
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const filteredData = sortedData.filter(item =>
    item.bulan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tahun.toString().includes(searchTerm) ||
    item.total_panen.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const requestSort = (key: keyof HarvestData) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Data Hasil Panen</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari data panen..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('bulan')}
              >
                <div className="flex items-center">
                  Bulan
                  {sortConfig?.key === 'bulan' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('tahun')}
              >
                <div className="flex items-center">
                  Tahun
                  {sortConfig?.key === 'tahun' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('total_panen')}
              >
                <div className="flex items-center">
                  Total Panen
                  {sortConfig?.key === 'total_panen' && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis Rumput Laut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ backgroundColor: 'rgba(240, 253, 244, 1)' }}
                className="hover:bg-green-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.bulan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tahun}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{item.total_panen}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {item.jenisRumputLaut.map((jenis, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {jenis}
                      </span>
                    ))}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default HarvestDataTable
