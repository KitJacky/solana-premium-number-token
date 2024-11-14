import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GenerationStatsProps {
  difficulty: number;
  addressesGenerated: number;
  estimatedTime: string;
  speed: number;
  status: string;
  progress: number;
}

const GenerationStats = ({
  difficulty,
  addressesGenerated,
  estimatedTime,
  speed,
  status,
  progress,
}: GenerationStatsProps) => {
  return (
    <Card className="p-6 bg-solana-gray border-none">
      <h2 className="text-xl font-bold mb-6 text-solana-green">Generation Info</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-400">Difficulty</span>
          <p className="text-lg font-semibold text-white">{difficulty}</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">Generated</span>
          <p className="text-lg font-semibold text-white">{addressesGenerated} Addresses</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">Estimated Time</span>
          <p className="text-lg font-semibold text-white">{estimatedTime}</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">Speed</span>
          <p className="text-lg font-semibold text-white">{speed} Addresses/sec</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">Status</span>
          <p className="text-lg font-semibold text-white">{status}</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">Progress</span>
          <div className="mt-2">
            <Progress value={progress} className="h-2 bg-solana-dark" />
            <span className="text-sm mt-1 inline-block text-white">{progress}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GenerationStats;