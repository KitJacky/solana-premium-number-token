import { useEffect, useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AccountInfoProps {
  address: string;
}

const AccountInfo = ({ address }: AccountInfoProps) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const connection = new Connection("https://api.mainnet-beta.solana.com");
        const publicKey = new PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (err) {
        setError("Failed to fetch account information");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountInfo();
  }, [address]);

  return (
    <Card className="p-6 bg-solana-gray border-none">
      <h2 className="text-xl font-bold mb-4 text-solana-green">Account Information</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      ) : error ? (
        <div className="text-red-400 py-2">{error}</div>
      ) : (
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium block mb-2 text-white">SOL Balance</span>
            <div className="bg-solana-dark p-3 rounded-md text-white">
              {balance?.toFixed(9)} SOL
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AccountInfo;