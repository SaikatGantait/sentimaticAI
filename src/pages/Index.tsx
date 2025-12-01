import { useEffect, useState } from "react";
import { fetchMockTokens, fetchMockWallets, fetchMockSentiment } from "@/services/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TokenCard from "@/components/tokens/TokenCard";
import TokenDetails from "@/components/tokens/TokenDetails";
import WalletCard from "@/components/wallets/WalletCard";
import TradeLogItem from "@/components/trades/TradeLogItem";
import InfluencerCard from "@/components/influencers/InfluencerCard";
import AutoTradePanel from "@/components/trades/AutoTradePanel";
import AddWalletDialog from "@/components/wallets/AddWalletDialog";
import AddInfluencerDialog from "@/components/influencers/AddInfluencerDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Zap, Search } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<any | null>(null);
  const [sentiment, setSentiment] = useState<any | null>(null);
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [tradeLogs, setTradeLogs] = useState<any[]>([]);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [query, setQuery] = useState("");
  const [marketFilter, setMarketFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("liquidity");
  const [loadingTokens, setLoadingTokens] = useState(true);

  useEffect(() => {
    // Load tokens
    fetchMockTokens().then((t) => {
      setTokens(t);
      setLoadingTokens(false);
    });
    
    // Load wallets from localStorage or mock data
    const local = window.localStorage.getItem("apthack_wallets");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const uniques = parsed.filter(
          (w: any, i: number, arr: any[]) =>
            arr.findIndex((a) => a.address?.toLowerCase() === w.address?.toLowerCase()) === i
        );
        setWallets(uniques);
      } catch (e) {
        fetchMockWallets().then(setWallets);
      }
    } else {
      fetchMockWallets().then((ws: any[]) => {
        const uniques = ws.filter(
          (w: any, i: number, arr: any[]) =>
            arr.findIndex((a) => a.address?.toLowerCase() === w.address?.toLowerCase()) === i
        );
        setWallets(uniques);
        window.localStorage.setItem("apthack_wallets", JSON.stringify(uniques));
      });
    }

    // Load mock influencers
    setInfluencers([
      { name: "ElonMeme", handle: "@elonmeme", followers: 32000000, lastMention: "MEME" },
      { name: "CryptoGuru", handle: "@cryptoguru", followers: 12000, lastMention: "PRIV" },
      { name: "MemeLord", handle: "@memelord", followers: 3450, lastMention: "ZLA" },
    ]);
  }, []);

  async function handleSelectToken(token: any) {
    setSelectedToken(token);
    const s = await fetchMockSentiment(token.symbol);
    setSentiment(s);
  }

  function handleAddWallet(w: any) {
    const wallet = {
      address: w.address,
      name: w.name || w.address,
      tokens: w.tokens || [],
      value: w.value || 0,
    };
    const addr = wallet.address?.toLowerCase();
    setWallets((p) => {
      if (p.some((x) => x.address?.toLowerCase() === addr)) {
        toast.info("Wallet already added");
        return p;
      }
      const next = [wallet, ...p];
      window.localStorage.setItem("apthack_wallets", JSON.stringify(next));
      toast.success("Wallet added successfully");
      return next;
    });
  }

  function handleRemoveWallet(address: string) {
    const clean = address?.toLowerCase();
    setWallets((p) => {
      const next = p.filter((w) => w.address?.toLowerCase() !== clean);
      window.localStorage.setItem("apthack_wallets", JSON.stringify(next));
      toast.success("Wallet removed");
      return next;
    });
  }

  function handleAddInfluencer(handle: string) {
    setInfluencers((p) => [
      { name: handle.replace("@", ""), handle, followers: 0, lastMention: "" },
      ...p,
    ]);
    toast.success("Influencer added to tracker");
  }

  function handleBuy() {
    if (!selectedToken) return;
    const newLog = {
      token: selectedToken.symbol,
      action: "BUY",
      amount: (Math.random() * 250).toFixed(2),
      reason: "High sentiment + Strong liquidity",
    };
    setTradeLogs((p) => [newLog, ...p]);
    toast.success(`Simulated BUY of ${selectedToken.symbol}`);
  }

  function handleSell() {
    if (!selectedToken) return;
    const newLog = {
      token: selectedToken.symbol,
      action: "SELL",
      amount: (Math.random() * 250).toFixed(2),
      reason: "Take profit / Low sentiment",
    };
    setTradeLogs((p) => [newLog, ...p]);
    toast.success(`Simulated SELL of ${selectedToken.symbol}`);
  }

  const markets = Array.from(new Set(tokens.map((t) => t.market)));
  const filteredSorted = tokens
    .filter((t) =>
      `${t.symbol} ${t.name}`.toLowerCase().includes(query.trim().toLowerCase()) &&
      (marketFilter === "all" || t.market === marketFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "change":
          return (b.change24h ?? 0) - (a.change24h ?? 0);
        case "price":
          return (b.price ?? 0) - (a.price ?? 0);
        case "name":
          return String(a.symbol).localeCompare(String(b.symbol));
        default:
          return (b.liquidityUsd ?? 0) - (a.liquidityUsd ?? 0);
      }
    });

  return (
    <div className="min-h-screen bg-background relative">
      {/* Geometric background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-success/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <DashboardHeader onAddWallet={() => setShowAddWallet(true)} />

      <main className="container mx-auto px-6 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tokens */}
            <Card className="p-6 bg-white shadow-lg border border-border">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-2">
                <div>
                  <h2 className="text-xl font-semibold">Available Tokens</h2>
                  <p className="text-sm text-muted-foreground">{filteredSorted.length} results</p>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <div className="relative w-full md:w-64">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      <Search className="w-4 h-4" />
                    </span>
                    <Input
                      aria-label="Search tokens"
                      placeholder="Search by name or symbol"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={marketFilter} onValueChange={setMarketFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Market" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Markets</SelectItem>
                      {markets.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liquidity">Liquidity</SelectItem>
                      <SelectItem value="change">24h Change</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="name">Symbol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3">
                {loadingTokens ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))
                ) : filteredSorted.length ? (
                  filteredSorted.map((token) => (
                    <TokenCard
                      key={token.symbol}
                      token={token}
                      isSelected={selectedToken?.symbol === token.symbol}
                      onClick={() => handleSelectToken(token)}
                    />
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-6 text-center">No tokens match your filters.</div>
                )}
              </div>
            </Card>

            {/* Selected Token Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Token Analysis</h2>
              <TokenDetails
                token={selectedToken}
                sentiment={sentiment}
                onBuy={handleBuy}
                onSell={handleSell}
              />
            </div>

            {/* Trade History */}
            {tradeLogs.length > 0 && (
              <Card className="p-6 bg-white shadow-lg border border-border">
                <h2 className="text-xl font-semibold mb-4">Trade History</h2>
                <div className="space-y-2">
                  {tradeLogs.map((log, idx) => (
                    <TradeLogItem key={idx} log={log} />
                  ))}
                </div>
              </Card>
            )}

            {/* Influencer Tracker */}
            <Card className="p-6 bg-white shadow-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Influencer Tracker</h2>
                <AddInfluencerDialog onAdd={handleAddInfluencer} />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Track influencer mentions and get alerts on trending tokens
              </p>
              <div className="space-y-2">
                {influencers.map((inf, idx) => (
                  <InfluencerCard key={idx} influencer={inf} />
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Wallets */}
            <Card className="p-6 bg-white shadow-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Wallets</h3>
                <AddWalletDialog onAdd={handleAddWallet} />
              </div>
              {wallets.length === 0 ? (
                <div className="text-sm text-muted-foreground">No wallets yet. Add one to get started.</div>
              ) : (
                <div className="space-y-2">
                  {wallets.map((w) => (
                    <WalletCard key={w.address} wallet={w} onRemove={() => handleRemoveWallet(w.address)} />
                  ))}
                </div>
              )}
            </Card>

            {/* Auto-Trade Settings */}
            <AutoTradePanel selectedToken={selectedToken} />

            {/* Trading Console */}
            <Card className="p-6 bg-white shadow-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-warning" />
                <h3 className="text-lg font-semibold">Quick Trade</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Simulate trades with current market conditions
              </p>
              <div className="flex gap-3">
                <Button onClick={handleBuy} className="flex-1 bg-success hover:bg-success/90 text-white shadow-sm">
                  Sim Buy
                </Button>
                <Button onClick={handleSell} variant="outline" className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/5">
                  Sim Sell
                </Button>
              </div>
            </Card>

            {/* Signals & Backup */}
            <Card className="p-6 bg-white shadow-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-info" />
                <h3 className="text-lg font-semibold">Reports</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get automated analysis and backup reports via email
              </p>
              <Button
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => toast.info("Backup email sent (simulated)")}
              >
                Send Analysis Report
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <AddWalletDialog
        onAdd={handleAddWallet}
        trigger={
          <button style={{ display: "none" }} onClick={() => setShowAddWallet(true)}>
            Hidden Trigger
          </button>
        }
      />
    </div>
  );
};

export default Index;
