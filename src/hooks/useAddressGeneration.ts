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

const calculateDifficulty = (prefix: string, suffix: string): number => {
  const base = 58;
  
  if (!prefix && !suffix) return 0;
  
  let difficulty = 1;
  
  if (prefix) {
    difficulty *= Math.pow(base, prefix.length);
  }
  
  if (suffix) {
    difficulty *= Math.pow(base, suffix.length);
  }
  
  return Math.floor(difficulty);
};

const useAddressGeneration = () => {
  const [stats, setStats] = useState<GenerationStats>({
    difficulty: 0,
    addressesGenerated: 0,
    estimatedTime: "Calculating...",
    speed: 0,
    status: "Ready",
    progress: 0,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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

  const togglePause = () => {
    setIsPaused(prev => !prev);
    setStats(prev => ({
      ...prev,
      status: isPaused ? "Generating" : "Paused"
    }));
  };

  const generateAddress = async (prefix: string, suffix: string, threads: string, caseSensitive: string) => {
    if (!prefix && !suffix) {
      toast({
        title: "Error",
        description: "Please enter a prefix or suffix",
        variant: "destructive",
      });
      return;
    }

    const difficulty = calculateDifficulty(prefix, suffix);
    setStats(prev => ({ 
      ...prev, 
      difficulty,
      status: "Generating" 
    }));

    setIsGenerating(true);
    setGeneratedKeypair(null);
    setIsPaused(false);

    const startTime = Date.now();
    let totalAddressesGenerated = 0;
    const threadCount = parseInt(threads);
    const batchSize = 100;
    let shouldContinue = true;

    const updateInterval = setInterval(() => {
      if (!isPaused) {
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = Math.floor(totalAddressesGenerated / elapsed);
        
        setStats(prev => ({
          ...prev,
          addressesGenerated: totalAddressesGenerated,
          speed: speed,
          estimatedTime: elapsed < 2 ? "Calculating..." : `${Math.floor(elapsed)} seconds`,
          progress: Math.min(Math.floor((totalAddressesGenerated / 1000000) * 100), 100),
        }));
      }
    }, 1000);

    const workers = Array.from({ length: threadCount }, async () => {
      while (shouldContinue) {
        if (isPaused) {
          await sleep(100);
          continue;
        }

        for (let i = 0; i < batchSize && !isPaused && shouldContinue; i++) {
          const keypair = Keypair.generate();
          totalAddressesGenerated++;
          
          if (isValidAddress(keypair.publicKey.toString(), prefix, suffix, caseSensitive)) {
            shouldContinue = false;
            return keypair;
          }
          
          await sleep(10);
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
      shouldContinue = false;
      clearInterval(updateInterval);
      setIsGenerating(false);
      setIsPaused(false);
    }
  };

  return {
    stats,
    isGenerating,
    isPaused,
    generatedKeypair,
    generateAddress,
    togglePause,
  };
};

export default useAddressGeneration;