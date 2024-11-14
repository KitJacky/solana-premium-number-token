import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import { useToast } from "@/components/ui/use-toast";

interface GenerationStats {
  difficulty: number;
  addressesGenerated: number;
  estimatedTime: string;
  speed: number;
  status: string;
  progress: number;
}

const useAddressGeneration = () => {
  const [stats, setStats] = useState<GenerationStats>({
    difficulty: 58,
    addressesGenerated: 0,
    estimatedTime: "Calculating...",
    speed: 0,
    status: "Ready",
    progress: 0,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKeypair, setGeneratedKeypair] = useState<Keypair | null>(null);
  const { toast } = useToast();

  const isValidAddress = (address: string, prefix: string, suffix: string, caseSensitive: string) => {
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

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateAddress = async (prefix: string, suffix: string, threads: string, caseSensitive: string) => {
    if (!prefix && !suffix) {
      toast({
        title: "Error",
        description: "Please enter a prefix or suffix",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedKeypair(null);
    setStats(prev => ({ ...prev, status: "Generating" }));

    const startTime = Date.now();
    let totalAddressesGenerated = 0;
    const threadCount = parseInt(threads);
    const batchSize = 100;

    const updateInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const speed = Math.floor(totalAddressesGenerated / elapsed);
      
      setStats(prev => ({
        ...prev,
        addressesGenerated: totalAddressesGenerated,
        speed: speed,
        estimatedTime: elapsed < 2 ? "Calculating..." : `${Math.floor(elapsed)} seconds`,
        progress: Math.min(Math.floor((totalAddressesGenerated / 1000000) * 100), 100),
      }));
    }, 1000);

    const workers = Array.from({ length: threadCount }, async () => {
      while (true) {
        for (let i = 0; i < batchSize; i++) {
          const keypair = Keypair.generate();
          totalAddressesGenerated++;
          
          if (isValidAddress(keypair.publicKey.toString(), prefix, suffix, caseSensitive)) {
            return keypair;
          }
          
          await sleep(10); // Prevent CPU overload
        }
      }
    });

    try {
      const result = await Promise.race(workers);
      
      if (result) {
        setGeneratedKeypair(result);
        setStats(prev => ({ ...prev, status: "Completed", progress: 100 }));
        toast({
          title: "Success",
          description: "Address generated successfully",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred during generation",
        variant: "destructive",
      });
      setStats(prev => ({ ...prev, status: "Failed" }));
    } finally {
      clearInterval(updateInterval);
      setIsGenerating(false);
    }
  };

  return {
    stats,
    isGenerating,
    generatedKeypair,
    generateAddress,
  };
};

export default useAddressGeneration;