import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Token {
  symbol: string;
  name: string;
  price: number;
  market: string;
  liquidityUsd: number;
  change24h: number;
}

interface TokenCardProps {
  token: Token;
  isSelected: boolean;
  onClick: () => void;
}

export default function TokenCard({ token, isSelected, onClick }: TokenCardProps) {
  const isPositive = token.change24h >= 0;

  return (
    <Card
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border ${
        isSelected ? 'ring-2 ring-primary bg-primary/5 shadow-md' : 'hover:border-primary/30 bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{token.symbol}</span>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
              {token.market}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">{token.name}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold">${token.price.toFixed(4)}</div>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(token.change24h).toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
        <span>Liquidity</span>
        <span className="font-medium">${(token.liquidityUsd / 1000000).toFixed(2)}M</span>
      </div>
    </Card>
  );
}
