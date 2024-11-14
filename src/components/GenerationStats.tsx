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
      <h2 className="text-xl font-bold mb-6 text-solana-green">生成信息</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-400">難度</span>
          <p className="text-lg font-semibold">{difficulty}</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">已生成</span>
          <p className="text-lg font-semibold">{addressesGenerated} 地址</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">預估時間</span>
          <p className="text-lg font-semibold">{estimatedTime}</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">速度</span>
          <p className="text-lg font-semibold">{speed} 地址/秒</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">狀態</span>
          <p className="text-lg font-semibold">{status}</p>
        </div>
        <div>
          <span className="text-sm text-gray-400">生成進度</span>
          <div className="mt-2">
            <Progress value={progress} className="h-2 bg-solana-dark" />
            <span className="text-sm mt-1 inline-block">{progress}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GenerationStats;