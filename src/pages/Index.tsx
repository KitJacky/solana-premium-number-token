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
import useAddressGeneration from "@/hooks/useAddressGeneration";

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
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="https://jk.hk/jk-logo-2020-w.svg" 
            alt="JK Labs Logo" 
            className="h-12 w-auto"
          />
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-solana-green to-solana-purple bg-clip-text text-transparent">
            Solana Premium Number Token Generator
          </h1>
          <p className="text-sm text-gray-400">
            Powered by <a href="https://3jk.net" target="_blank" rel="noopener noreferrer" className="text-solana-purple hover:text-solana-green">JK Labs</a>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-solana-gray border-none">
            <h2 className="text-xl font-bold mb-6 text-solana-green">Generation Settings</h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-white">Vanity Prefix</Label>
                <Input
                  placeholder="Enter prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="bg-solana-dark border-solana-purple mt-2 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">Vanity Suffix</Label>
                <Input
                  placeholder="Enter suffix"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="bg-solana-dark border-solana-purple mt-2 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">Thread Count</Label>
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
                <Label className="text-white">Case Sensitive</Label>
                <RadioGroup
                  value={caseSensitive}
                  onValueChange={setCaseSensitive}
                  className="mt-2 text-white"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" className="border-white" />
                    <Label htmlFor="no" className="text-white">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" className="border-white" />
                    <Label htmlFor="yes" className="text-white">Yes</Label>
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
                      Generating...
                    </>
                  ) : (
                    "Start Generation"
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