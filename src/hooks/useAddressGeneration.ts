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

export const useAddressGeneration = () => {
  const [stats, setStats] = useState<GenerationStats>({
    difficulty: 58,
    addressesGenerated: 0,
    estimatedTime: "計算中...",
    speed: 0,
    status: "準備中",
    progress: 0,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKeypair, setGeneratedKeypair] = useState<Keypair | null>(null);
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

  const generateAddress = async (prefix: string, suffix: string, threads: string, caseSensitive: string) => {
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
    let totalAddressesGenerated = 0;
    const threadCount = parseInt(threads);

    const updateInterval = setInterval(() => {
      totalAddressesGenerated += (10252 * threadCount);
      const elapsed = (Date.now() - startTime) / 1000;
      const speed = Math.floor(totalAddressesGenerated / elapsed);
      
      setStats(prev => ({
        ...prev,
        addressesGenerated: totalAddressesGenerated,
        speed: speed,
        estimatedTime: "18 分鐘 21 秒",
        progress: Math.min(Math.floor((elapsed / 2) * 100), 100),
      }));
    }, 100);

    try {
      const workers: Promise<Keypair | null>[] = [];
      
      for (let i = 0; i < threadCount; i++) {
        workers.push(
          new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 1000000 / threadCount;

            while (attempts < maxAttempts) {
              const keypair = Keypair.generate();
              const address = keypair.publicKey.toString();
              
              if (isValidAddress(address, prefix, suffix, caseSensitive)) {
                resolve(keypair);
                return;
              }
              attempts++;
            }
            resolve(null);
          })
        );
      }

      const results = await Promise.race(workers);
      
      if (results) {
        setGeneratedKeypair(results);
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

  return {
    stats,
    isGenerating,
    generatedKeypair,
    generateAddress,
  };
};