import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';

interface StatItem {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: string;
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export const StatsGrid = ({ stats, className }: StatsGridProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {stats.map((stat, index) => (
        <motion.div key={index} variants={itemVariants}>
          <DashboardCard
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            iconName={stat.icon}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;
