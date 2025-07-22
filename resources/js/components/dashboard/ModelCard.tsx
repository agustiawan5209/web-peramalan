import { motion } from 'framer-motion'
import { Leaf, BarChart2, Clock, ChevronRight } from 'lucide-react'

interface ModelCardProps {
  title: string;
  prediction: string | number;
  mse: number;
  rsquared: string | number;
}

const ModelCard = ({ title, prediction, mse, rsquared }: ModelCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="bg-green-50 p-2 rounded-full text-green-500">
            <Leaf size={20} />
          </div>
          <div>
            <h3 className="font-medium">Euchuma {title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <BarChart2 size={14} className="text-gray-400" />
              <span className="text-sm text-gray-500">Prediksi: {Number(prediction).toFixed(2)} Kg</span>
            </div>
            {/* <div className="flex items-center gap-2 mt-1">
              <Clock size={14} className="text-gray-400" />
              <span className="text-sm text-gray-500">Update: {mse}</span>
            </div> */}
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </motion.div>
  )
}

export default ModelCard
