import { Settings, Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AutoTradePanelProps {
  selectedToken: any;
}

export default function AutoTradePanel({ selectedToken }: AutoTradePanelProps) {
  const [isActive, setIsActive] = useState(false);
  const [buyThreshold, setBuyThreshold] = useState(0.75);
  const [sellThreshold, setSellThreshold] = useState(0.40);

  return (
    <Card className="p-6 bg-white shadow-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Auto-Trade Settings</h3>
      </div>

      {selectedToken ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
            <span className="text-sm font-medium">Auto-trading</span>
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsActive(!isActive)}
              className="gap-2"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isActive ? 'Active' : 'Inactive'}
            </Button>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Buy Threshold (Sentiment Score)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={buyThreshold}
              onChange={(e) => setBuyThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span className="text-success font-medium">{(buyThreshold * 100).toFixed(0)}%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Sell Threshold (Sentiment Score)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sellThreshold}
              onChange={(e) => setSellThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span className="text-destructive font-medium">{(sellThreshold * 100).toFixed(0)}%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-br from-muted/30 to-muted/50 border border-border/50 text-sm text-muted-foreground">
            Auto-buy when sentiment &gt; {(buyThreshold * 100).toFixed(0)}% and liquidity supports entry.
            Auto-sell when sentiment &lt; {(sellThreshold * 100).toFixed(0)}%.
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground text-sm py-4">
          Select a token to configure auto-trading
        </div>
      )}
    </Card>
  );
}
