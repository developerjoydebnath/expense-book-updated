// 'use client';

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
// import { useSummary } from "@/hooks/useSummary";
// import { Plus } from "lucide-react";
// import { useEffect } from "react";

// export function SummaryStats({ 
//   onAddMoney, 
//   onAddExpense,
//   refreshTrigger 
// }: { 
//   onAddMoney: () => void; 
//   onAddExpense: () => void;
//   refreshTrigger?: number;
// }) {
//   const { summary, isLoading, mutate } = useSummary();

//   console.log('refresh trigger before use effect', refreshTrigger)
  
//   useEffect(() => {
//     console.log('refresh trigger inside use effect', refreshTrigger)
//     if (refreshTrigger !== undefined) {
//       console.log('refresh trigger inside use effect check', refreshTrigger)
//       mutate();
//     }
//   }, [refreshTrigger, mutate]);

//   if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-32 animate-pulse bg-muted rounded-xl" />;
//   if (!summary) return <div>No data available</div>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       <Card className="bg-linear-to-br from-primary/20 to-primary/5 border-primary/20 shadow-lg">
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardDescription className="text-primary font-semibold uppercase tracking-wider">Available Money</CardDescription>
//           <Button size="icon" variant="default" onClick={onAddMoney} className="h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform">
//             <Plus size={20} />
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="text-3xl font-extrabold tracking-tight">৳ {summary.availableMoney?.toLocaleString()}</div>
//         </CardContent>
//       </Card>

//       <Card className="bg-linear-to-br from-destructive/20 to-destructive/5 border-destructive/20 shadow-lg">
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardDescription className="text-destructive font-semibold uppercase tracking-wider">Today&apos;s Expense</CardDescription>
//           <Button size="icon" variant="destructive" onClick={onAddExpense} className="h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform">
//             <Plus size={20} />
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="text-3xl font-extrabold tracking-tight">৳ {summary.todayExpense?.toLocaleString()}</div>
//         </CardContent>
//       </Card>

//       <Card className="bg-linear-to-br from-secondary/20 to-secondary/5 border-secondary/20 shadow-lg">
//         <CardHeader className="pb-2">
//           <CardDescription className="text-secondary-foreground font-semibold uppercase tracking-wider">Monthly Expense</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="text-3xl font-extrabold tracking-tight">৳ {summary.thisMonthExpense?.toLocaleString()}</div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useSummary } from "@/hooks/useSummary";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SummaryStats({ 
  onAddMoney, 
  onAddExpense,
  refreshTrigger 
}: { 
  onAddMoney: () => void; 
  onAddExpense: () => void;
  refreshTrigger?: number;
}) {
  const { summary, isLoading, mutate } = useSummary();
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const prevRefreshTrigger = useRef(refreshTrigger);
  const prevSummaryRef = useRef(summary);

  
  // Handle refreshTrigger changes (from parent)
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger !== prevRefreshTrigger.current) {
      prevRefreshTrigger.current = refreshTrigger;
      
      // Call mutate after a short delay
      const timer = setTimeout(() => {
        mutate();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger, mutate]);

  // Handle initial load - only once
  useEffect(() => {
    if (!initialLoadDone && !isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialLoadDone(true);
    }
  }, [initialLoadDone, isLoading]);

  // Loading skeleton for stats
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Money Skeleton */}
        <Card className="bg-linear-to-br from-primary/20 to-primary/5 border-primary/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-primary font-semibold uppercase tracking-wider">
              <div className="h-5 w-32 bg-primary/20 rounded animate-pulse"></div>
            </CardDescription>
            <div className="h-8 w-8 bg-primary/20 rounded-full animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-10 w-32 bg-primary/20 rounded animate-pulse"></div>
          </CardContent>
        </Card>

        {/* Today's Expense Skeleton */}
        <Card className="bg-linear-to-br from-destructive/20 to-destructive/5 border-destructive/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-destructive font-semibold uppercase tracking-wider">
              <div className="h-5 w-32 bg-destructive/20 rounded animate-pulse"></div>
            </CardDescription>
            <div className="h-8 w-8 bg-destructive/20 rounded-full animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-10 w-32 bg-destructive/20 rounded animate-pulse"></div>
          </CardContent>
        </Card>

        {/* Monthly Expense Skeleton */}
        <Card className="bg-linear-to-br from-accent/20 to-accent/5 border-accent/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-accent-foreground font-semibold uppercase tracking-wider">
              <div className="h-5 w-32 bg-black/20 rounded animate-pulse"></div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-10 w-32 bg-black/20 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!summary) return <div>No data available</div>;

  console.log('Rendering summary data:', summary);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-linear-to-br from-primary/20 to-primary/5 border-primary/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription className="text-primary font-semibold uppercase tracking-wider">Available Money</CardDescription>
          <Button size="icon" variant="default" onClick={onAddMoney} className="h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform">
            <Plus size={20} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight">৳ {summary.availableMoney?.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-destructive/20 to-destructive/5 border-destructive/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardDescription className="text-destructive font-semibold uppercase tracking-wider">Today&apos;s Expense</CardDescription>
          <Button size="icon" variant="destructive" onClick={onAddExpense} className="h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform">
            <Plus size={20} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight">৳ {summary.todayExpense?.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-secondary/20 to-secondary/5 border-secondary/20 shadow-lg">
        <CardHeader className="pb-2">
          <CardDescription className="text-secondary-foreground font-semibold uppercase tracking-wider">Monthly Expense</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tight">৳ {summary.thisMonthExpense?.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}