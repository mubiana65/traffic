import { motion } from 'framer-motion';

interface BoxProps {
  title: string;
  description?: string;
  icon?: string;
  color?: string; // Tailwind border color, e.g., 'border-blue-500'
  statusColor?: string; // Tailwind bg color for status dot, e.g., 'bg-green-400'
  children?: React.ReactNode;
}

interface BoxDiagramProps {
  boxes: BoxProps[];
  title?: string;
  description?: string;
}

export default function BoxDiagram({ boxes, title, description }: BoxDiagramProps) {
  return (
    <div className="bg-gray-900/80 rounded-3xl p-8 shadow-2xl">
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && <h2 className="text-3xl font-extrabold mb-2 text-white drop-shadow">{title}</h2>}
          {description && <p className="text-gray-300 text-lg">{description}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {boxes.map((box, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white/10 backdrop-blur-md border-2 border-transparent rounded-3xl p-6 shadow-xl transition duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500 group overflow-hidden`}
          >
            {/* Accent Bar */}
            <div className={`absolute left-0 top-0 h-full w-2 ${box.color || 'bg-gradient-to-b from-blue-500 to-green-400'} rounded-l-3xl`}></div>
            {/* Status Dot or Icon */}
            <div className="absolute top-4 right-4">
              {box.statusColor && <span className={`inline-block w-3 h-3 rounded-full ${box.statusColor}`}></span>}
              {box.icon && !box.statusColor && <span className="text-2xl">{box.icon}</span>}
            </div>
            {/* Card Content */}
            <div className="pl-4">
              <h3 className="text-xl font-extrabold mb-1 tracking-wide text-white drop-shadow">{box.title}</h3>
              {box.description && <p className="text-gray-300 text-sm mb-2">{box.description}</p>}
              {box.children && <div className="mt-4 space-y-2">{box.children}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Example usage:
/*
const systemArchitecture = {
  title: "System Architecture",
  description: "Overview of the traffic management system components",
  boxes: [
    {
      title: "Frontend",
      description: "React-based user interface",
      icon: "🌐",
      color: "border-blue-500",
      children: (
        <>
          <div className="text-sm text-gray-400">• Dashboard</div>
          <div className="text-sm text-gray-400">• Analytics</div>
          <div className="text-sm text-gray-400">• System Control</div>
        </>
      )
    },
    {
      title: "Backend",
      description: "Node.js server and API",
      icon: "⚙️",
      color: "border-green-500",
      children: (
        <>
          <div className="text-sm text-gray-400">• REST API</div>
          <div className="text-sm text-gray-400">• WebSocket</div>
          <div className="text-sm text-gray-400">• Authentication</div>
        </>
      )
    },
    {
      title: "Database",
      description: "Firebase Realtime Database",
      icon: "🗄️",
      color: "border-yellow-500",
      children: (
        <>
          <div className="text-sm text-gray-400">• Traffic Data</div>
          <div className="text-sm text-gray-400">• User Data</div>
          <div className="text-sm text-gray-400">• System Logs</div>
        </>
      )
    }
  ]
};

<BoxDiagram {...systemArchitecture} />
*/ 