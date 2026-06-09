import { motion } from 'framer-motion';
import { useAssetStore } from '../../store/useAssetStore';
import { cn } from '../../utils/helpers';

const FloorSelector = () => {
  const { selectedFloor, setSelectedFloor } = useAssetStore();
  const floors = [1, 2, 3, 4, 5];
  const floorNames = ['', '一层大厅', '二层办公', '三层研发', '四层会议', '五层高管'];

  return (
    <div className="flex items-center gap-2">
      {floors.map((floor) => (
        <motion.button
          key={floor}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedFloor(floor)}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm",
            selectedFloor === floor
              ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-glow"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
          )}
        >
          <div className="font-display text-lg">{floor}F</div>
          <div className="text-xs opacity-70">{floorNames[floor]}</div>
        </motion.button>
      ))}
    </div>
  );
};

export default FloorSelector;
