import { motion } from 'framer-motion';

export default function About() {
  const features = [
    {
      title: 'Real-time Monitoring',
      description: 'Monitor traffic light status and system performance in real-time with live updates and instant notifications.',
      icon: '📊'
    },
    {
      title: 'Smart Analytics',
      description: 'Advanced analytics and reporting tools to analyze traffic patterns and optimize signal timing.',
      icon: '📈'
    },
    {
      title: 'Automated Control',
      description: 'AI-powered traffic management system that automatically adjusts signal timing based on traffic conditions.',
      icon: '🤖'
    },
    {
      title: 'Emergency Response',
      description: 'Quick response system for emergency vehicles with priority signal control and automatic route clearing.',
      icon: '🚑'
    }
  ];

  const team = [
    {
      name: 'John Doe',
      role: 'System Architect',
      bio: '10+ years of experience in traffic management systems and urban planning.',
      image: 'https://via.placeholder.com/150'
    },
    {
      name: 'Jane Smith',
      role: 'AI Engineer',
      bio: 'Specializes in machine learning and computer vision for traffic analysis.',
      image: 'https://via.placeholder.com/150'
    },
    {
      name: 'Mike Johnson',
      role: 'Operations Manager',
      bio: 'Expert in traffic flow optimization and emergency response coordination.',
      image: 'https://via.placeholder.com/150'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">About Our Traffic Management System</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A state-of-the-art traffic management solution designed to optimize traffic flow,
            reduce congestion, and improve road safety in urban areas.
          </p>
        </motion.div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-400 mb-2">{member.role}</p>
                <p className="text-gray-400">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-8 shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            To revolutionize urban traffic management through innovative technology,
            making cities safer, more efficient, and more sustainable for everyone.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 