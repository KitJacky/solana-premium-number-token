import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import AddressDisplay from "@/components/AddressDisplay";
import AccountInfo from "@/components/AccountInfo";
import GenerationStats from "@/components/GenerationStats";
import { useAddressGeneration } from "@/hooks/useAddressGeneration";

const Index = () => {
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [threads, setThreads] = useState("1");
  const [caseSensitive, setCaseSensitive] = useState("no");
  
  const {
    stats,
    isGenerating,
    generatedKeypair,
    generateAddress,
  } = useAddressGeneration();

  const handleGenerate = () => {
    generateAddress(prefix, suffix, threads, caseSensitive);
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
                  onClick={handleGenerate}
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