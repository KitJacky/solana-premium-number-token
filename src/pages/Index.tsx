import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import AddressDisplay from "@/components/AddressDisplay";
import AccountInfo from "@/components/AccountInfo";

const Index = () => {
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKeypair, setGeneratedKeypair] = useState<Keypair | null>(null);
  const { toast } = useToast();

  const generateVanityAddress = async () => {
    if (!prefix && !suffix) {
      toast({
        title: "Error",
        description: "Please enter a prefix or suffix",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let found = false;
      while (!found) {
        const keypair = Keypair.generate();
        const address = keypair.publicKey.toString();
        
        if (
          (!prefix || address.toLowerCase().startsWith(prefix.toLowerCase())) &&
          (!suffix || address.toLowerCase().endsWith(suffix.toLowerCase()))
        ) {
          setGeneratedKeypair(keypair);
          found = true;
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-solana-dark text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-solana-green to-solana-purple bg-clip-text text-transparent">
          Solana Vanity Address Generator
        </h1>

        <Card className="p-6 bg-solana-gray border-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Prefix</label>
              <Input
                placeholder="Enter desired prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="bg-solana-dark border-solana-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Suffix</label>
              <Input
                placeholder="Enter desired suffix"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                className="bg-solana-dark border-solana-purple"
              />
            </div>
          </div>

          <Button
            onClick={generateVanityAddress}
            disabled={isGenerating}
            className="w-full bg-solana-purple hover:bg-solana-purple/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Address"
            )}
          </Button>
        </Card>

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