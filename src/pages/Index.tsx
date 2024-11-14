import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import AddressDisplay from "@/components/AddressDisplay";
import AccountInfo from "@/components/AccountInfo";
import GenerationStats from "@/components/GenerationStats";

const Index = () => {
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [threads, setThreads] = useState("1");
  const [caseSensitive, setCaseSensitive] = useState("no");
  const [generatedKeypair, setGeneratedKeypair] = useState<Keypair | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({
    difficulty: 58,
    addressesGenerated: 0,
    estimatedTime: "計算中...",
    speed: 0,
    status: "準備中",
    progress: 0,
  });

  const { toast } = useToast();

  const generateAddress = async () => {
    if (!prefix && !suffix) {
      toast({
        title: "錯誤",
        description: "請至少輸入前綴或後綴",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setStats(prev => ({ ...prev, status: "生成中" }));

    // 模擬地址生成過程
    const startTime = Date.now();
    const updateInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setStats(prev => ({
        ...prev,
        addressesGenerated: Math.floor(elapsed * 10252),
        speed: 10252,
        estimatedTime: "18 分鐘 21 秒",
        progress: Math.min(Math.floor((elapsed / 2) * 100), 100),
      }));
    }, 100);

    try {
      // 實際的地址生成邏輯將在這裡實現
      const keypair = Keypair.generate();
      setTimeout(() => {
        setGeneratedKeypair(keypair);
        setIsGenerating(false);
        clearInterval(updateInterval);
        setStats(prev => ({
          ...prev,
          status: "已完成",
          progress: 100,
        }));
      }, 2000);
    } catch (error) {
      toast({
        title: "錯誤",
        description: "生成地址時發生錯誤",
        variant: "destructive",
      });
      setIsGenerating(false);
      clearInterval(updateInterval);
    }
  };

  return (
    <div className="min-h-screen bg-solana-dark text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-solana-green to-solana-purple bg-clip-text text-transparent">
          Solana 靚號生成器
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-solana-gray border-none">
            <h2 className="text-xl font-bold mb-6 text-solana-green">生成設置</h2>
            
            <div className="space-y-6">
              <div>
                <Label>靚號前綴</Label>
                <Input
                  placeholder="請輸入前綴"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="bg-solana-dark border-solana-purple mt-2"
                />
              </div>

              <div>
                <Label>靚號後綴</Label>
                <Input
                  placeholder="請輸入後綴"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="bg-solana-dark border-solana-purple mt-2"
                />
              </div>

              <div>
                <Label>線程數量</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setThreads(prev => Math.max(1, parseInt(prev) - 1).toString())}
                    className="bg-solana-dark"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={threads}
                    onChange={(e) => setThreads(e.target.value)}
                    className="w-20 text-center bg-solana-dark border-solana-purple"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setThreads(prev => (parseInt(prev) + 1).toString())}
                    className="bg-solana-dark"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div>
                <Label>是否區分大小寫</Label>
                <RadioGroup
                  value={caseSensitive}
                  onValueChange={setCaseSensitive}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">否</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">是</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-4">
                <Button
                  onClick={generateAddress}
                  disabled={isGenerating}
                  className="w-full bg-solana-purple hover:bg-solana-purple/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    "開始生成"
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <GenerationStats {...stats} />
        </div>

        {generatedKeypair && (
          <div className="space-y-6">
            <AddressDisplay keypair={generatedKeypair} />
            <AccountInfo address={generatedKeypair.publicKey.toString()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;