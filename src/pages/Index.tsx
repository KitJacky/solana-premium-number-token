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

  const isValidAddress = (address: string, prefix: string, suffix: string, caseSensitive: string): boolean => {
    if (!prefix && !suffix) return true;
    
    const compareStr = caseSensitive === "yes" ? 
      (s1: string, s2: string) => s1 === s2 :
      (s1: string, s2: string) => s1.toLowerCase() === s2.toLowerCase();
    
    if (prefix) {
      const addressPrefix = address.slice(0, prefix.length);
      if (!compareStr(addressPrefix, prefix)) return false;
    }
    
    if (suffix) {
      const addressSuffix = address.slice(-suffix.length);
      if (!compareStr(addressSuffix, suffix)) return false;
    }
    
    return true;
  };

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
      let foundKeypair: Keypair | null = null;
      let attempts = 0;
      const maxAttempts = 1000000; // 設置最大嘗試次數

      while (!foundKeypair && attempts < maxAttempts) {
        const keypair = Keypair.generate();
        const address = keypair.publicKey.toString();
        
        if (isValidAddress(address, prefix, suffix, caseSensitive)) {
          foundKeypair = keypair;
          break;
        }
        
        attempts++;
      }

      if (foundKeypair) {
        setGeneratedKeypair(foundKeypair);
        setStats(prev => ({
          ...prev,
          status: "已完成",
          progress: 100,
        }));
        toast({
          title: "成功",
          description: "已找到符合條件的地址",
        });
      } else {
        toast({
          title: "錯誤",
          description: "未能找到符合條件的地址，請重試",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "生成地址時發生錯誤",
        variant: "destructive",
      });
    } finally {
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
                <Label className="text-white">靚號前綴</Label>
                <Input
                  placeholder="請輸入前綴"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="bg-solana-dark border-solana-purple mt-2 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">靚號後綴</Label>
                <Input
                  placeholder="請輸入後綴"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="bg-solana-dark border-solana-purple mt-2 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">線程數量</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setThreads(prev => Math.max(1, parseInt(prev) - 1).toString())}
                    className="bg-solana-dark text-white"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={threads}
                    onChange={(e) => setThreads(e.target.value)}
                    className="w-20 text-center bg-solana-dark border-solana-purple text-white"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setThreads(prev => (parseInt(prev) + 1).toString())}
                    className="bg-solana-dark text-white"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-white">是否區分大小寫</Label>
                <RadioGroup
                  value={caseSensitive}
                  onValueChange={setCaseSensitive}
                  className="mt-2 text-white"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" className="border-white" />
                    <Label htmlFor="no" className="text-white">否</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" className="border-white" />
                    <Label htmlFor="yes" className="text-white">是</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-4">
                <Button
                  onClick={generateAddress}
                  disabled={isGenerating}
                  className="w-full bg-solana-purple hover:bg-solana-purple/90 text-white"
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