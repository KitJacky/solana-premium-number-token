import { Keypair } from "@solana/web3.js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddressDisplayProps {
  keypair: Keypair;
}

const AddressDisplay = ({ keypair }: AddressDisplayProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <Card className="p-6 bg-solana-gray border-none">
      <h2 className="text-xl font-bold mb-4 text-solana-green">Generated Keys</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white">Public Address</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(keypair.publicKey.toString(), "Public address")}
              className="text-white"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-solana-dark p-3 rounded-md break-all text-white">
            {keypair.publicKey.toString()}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white">Private Key</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(Buffer.from(keypair.secretKey).toString("hex"), "Private key")}
              className="text-white"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-solana-dark p-3 rounded-md break-all font-mono text-sm text-white">
            {Buffer.from(keypair.secretKey).toString("hex")}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddressDisplay;