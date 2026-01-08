// 'use client';

// import { EditExpenseForm } from "@/components/forms/EditExpenseForm";
// import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useDeleteExpense, useExpenses } from "@/hooks/useExpenses";
// import { Expense } from "@/lib/types";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import { CalendarIcon, ChevronLeft, ChevronRight, Edit, RotateCcw, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// export function ExpenseTable({ 
//   initialDate, 
//   hideFilter, 
//   limit, 
//   orderBy,
//   refreshTrigger 
// }: { 
//   initialDate?: string; 
//   hideFilter?: boolean; 
//   limit?: number;
//   orderBy?: Record<string, string>[];
//   refreshTrigger?: number;
// }) {
//   const [date, setDate] = useState<Date | undefined>(initialDate ? new Date(initialDate) : undefined);
//   const { expenses, isLoading, mutate } = useExpenses(
//     date ? format(date, "yyyy-MM-dd") : undefined,
//     limit,
//     orderBy
//   );

//   useEffect(() => {
//     if (refreshTrigger !== undefined) {
//       mutate();
//     }
//   }, [refreshTrigger, mutate]);
//   const { executeMutation: deleteExpense, fetching: deleting } = useDeleteExpense();
//   const [search, setSearch] = useState("");
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [editExpense, setEditExpense] = useState<Expense | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   if (isLoading) return <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 w-full animate-pulse bg-muted rounded" />)}</div>;
  
//   const filtered = (expenses || []).filter((e: Expense) =>
//     e.source.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filtered.length / pageSize);
//   const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   const handleReset = () => {
//     setSearch("");
//     setDate(undefined);
//     setCurrentPage(1);
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;
//     try {
//       await deleteExpense({ id: deleteId });
//       mutate();
//       toast.success("Expense deleted");
//     } catch (e: unknown) {
//       toast.error(e instanceof Error ? e.message : "Failed to delete expense");
//     } finally {
//       setDeleteId(null);
//     }
//   };

//   const handleEditSuccess = () => {
//     mutate();
//     setEditExpense(null);
//   };

//   return (
//     <div className="space-y-4">
//       {!hideFilter && (
//         <div className="flex flex-col sm:flex-row items-center gap-3">
//           <Input
//             placeholder="Search items..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="flex-1"
//           />
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant={"outline"}
//                 className={cn(
//                   "w-full sm:w-[240px] justify-start text-left font-normal",
//                   !date && "text-muted-foreground"
//                 )}
//               >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {date ? format(date, "PPP") : <span>Filter by date</span>}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="end">
//               <Calendar
//                 mode="single"
//                 selected={date}
//                 onSelect={setDate}
//                 initialFocus
//                 disabled={(date) => date > new Date()}
//               />
//               {date && (
//                 <div className="p-3 border-t">
//                   <Button variant="ghost" size="sm" onClick={() => setDate(undefined)} className="w-full text-xs h-7">Clear Filter</Button>
//                 </div>
//               )}
//             </PopoverContent>
//           </Popover>
//           {(search || date) && (
//             <Button 
//               variant="outline" 
//               onClick={handleReset}
//               className="w-full sm:w-auto text-muted-foreground hover:text-primary gap-2"
//             >
//               <RotateCcw size={14} />
//               Reset
//             </Button>
//           )}
//         </div>
//       )}

//       <div className="rounded-md border overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-muted/50">
//               <TableHead className="font-bold">Source</TableHead>
//               <TableHead className="font-bold text-right">Amount</TableHead>
//               <TableHead className="font-bold text-center">Date</TableHead>
//               <TableHead className="font-bold text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedData.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No expenses found</TableCell>
//               </TableRow>
//             ) : (
//               paginatedData.map((expense: Expense) => (
//                 <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
//                   <TableCell className="font-medium">{expense.source}</TableCell>
//                   <TableCell className="text-right font-semibold text-destructive">৳ {expense.amount.toLocaleString()}</TableCell>
//                   <TableCell className="text-center text-muted-foreground text-sm">{format(new Date(expense.date), "dd MMM yyyy")}</TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-1">
//                       <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => setEditExpense(expense)}>
//                         <Edit size={16} />
//                       </Button>
//                       <Button 
//                         size="icon" 
//                         variant="ghost" 
//                         className="h-8 w-8 text-destructive hover:bg-destructive/10" 
//                         onClick={() => setDeleteId(expense.id)}
//                       >
//                         <Trash2 size={16} />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//           {filtered.length > 0 && (
//             <TableFooter>
//               <TableRow>
//                 <TableCell colSpan={3} className="font-bold text-right italic">Total:</TableCell>
//                 <TableCell className="text-right font-extrabold text-lg text-destructive">
//                   ৳ {filtered.reduce((sum: number, e: Expense) => sum + e.amount, 0).toLocaleString()}
//                 </TableCell>
//               </TableRow>
//             </TableFooter>
//           )}
//         </Table>
//       </div>

//       {filtered.length > 0 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-muted-foreground">Show</span>
//             <Select 
//               value={pageSize.toString()} 
//               onValueChange={(v) => {
//                 setPageSize(Number(v));
//                 setCurrentPage(1);
//               }}
//             >
//               <SelectTrigger className="w-[70px] h-8 text-xs">
//                 <SelectValue placeholder={pageSize} />
//               </SelectTrigger>
//               <SelectContent>
//                 {[10, 20, 50, 100].map(size => (
//                   <SelectItem key={size} value={size.toString()} className="text-xs">
//                     {size}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <span className="text-sm text-muted-foreground">per page</span>
//           </div>

//           <div className="flex items-center gap-6">
//             <span className="text-sm text-muted-foreground">
//               Page {currentPage} of {totalPages || 1}
//             </span>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-8 w-8"
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft size={16} />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-8 w-8"
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages || totalPages === 0}
//               >
//                 <ChevronRight size={16} />
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ConfirmDialog
//         open={!!deleteId}
//         onOpenChange={(open) => !open && setDeleteId(null)}
//         title="Delete Expense"
//         message="Are you sure you want to delete this expense? This action cannot be undone."
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteId(null)}
//         loading={deleting}
//         confirmLabel="Delete"
//       />

//       <Dialog open={!!editExpense} onOpenChange={(open) => !open && setEditExpense(null)}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader><DialogTitle>Edit Expense</DialogTitle></DialogHeader>
//           {editExpense && (
//             <EditExpenseForm expense={editExpense} onSuccess={handleEditSuccess} />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



// components/dashboard/ExpenseTable.tsx
'use client';

import { EditExpenseForm } from "@/components/forms/EditExpenseForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteExpense, useExpenses } from "@/hooks/useExpenses";
import { Expense } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Edit, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function ExpenseTable({ 
  initialDate, 
  hideFilter, 
  limit, 
  orderBy,
  refreshTrigger 
}: { 
  initialDate?: string; 
  hideFilter?: boolean; 
  limit?: number;
  orderBy?: Record<string, string>[];
  refreshTrigger?: number;
}) {
  const [date, setDate] = useState<Date | undefined>(initialDate ? new Date(initialDate) : undefined);
  const { expenses, isLoading, mutate } = useExpenses(
    date ? format(date, "yyyy-MM-dd") : undefined,
    limit,
    orderBy
  );
  
  const prevRefreshTrigger = useRef(refreshTrigger);
  const hasMounted = useRef(false);

  useEffect(() => {
    // Skip on initial mount
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    
    // Only run if refreshTrigger actually changed
    if (refreshTrigger !== undefined && refreshTrigger !== prevRefreshTrigger.current) {
      prevRefreshTrigger.current = refreshTrigger;
      
      // Force mutation with a small delay
      setTimeout(() => {
        mutate();
      }, 100);
    }
  }, [refreshTrigger, mutate]);
  
  const { executeMutation: deleteExpense, fetching: deleting } = useDeleteExpense();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (isLoading) return <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 w-full animate-pulse bg-muted rounded" />)}</div>;
  
  const filtered = (expenses || []).filter((e: Expense) =>
    e.source.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setSearch("");
    setDate(undefined);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExpense({ id: deleteId });
      mutate();
      toast.success("Expense deleted");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete expense");
    } finally {
      setDeleteId(null);
    }
  };

  const handleEditSuccess = () => {
    mutate();
    setEditExpense(null);
  };

  return (
    <div className="space-y-4">
      {!hideFilter && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Filter by date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date > new Date()}
              />
              {date && (
                <div className="p-3 border-t">
                  <Button variant="ghost" size="sm" onClick={() => setDate(undefined)} className="w-full text-xs h-7">Clear Filter</Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          {(search || date) && (
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full sm:w-auto text-muted-foreground hover:text-primary gap-2"
            >
              <RotateCcw size={14} />
              Reset
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">Source</TableHead>
              <TableHead className="font-bold text-right">Amount</TableHead>
              <TableHead className="font-bold text-center">Date</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No expenses found</TableCell>
              </TableRow>
            ) : (
              paginatedData.map((expense: Expense) => (
                <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{expense.source}</TableCell>
                  <TableCell className="text-right font-semibold text-destructive">৳ {expense.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-center text-muted-foreground text-sm">{format(new Date(expense.date), "dd MMM yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => setEditExpense(expense)}>
                        <Edit size={16} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10" 
                        onClick={() => setDeleteId(expense.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {filtered.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-bold text-right italic">Total:</TableCell>
                <TableCell className="text-right font-extrabold text-lg text-destructive">
                  ৳ {filtered.reduce((sum: number, e: Expense) => sum + e.amount, 0).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select 
              value={pageSize.toString()} 
              onValueChange={(v) => {
                setPageSize(Number(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] h-8 text-xs">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map(size => (
                  <SelectItem key={size} value={size.toString()} className="text-xs">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
        confirmLabel="Delete"
      />

      <Dialog open={!!editExpense} onOpenChange={(open) => !open && setEditExpense(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Edit Expense</DialogTitle></DialogHeader>
          {editExpense && (
            <EditExpenseForm expense={editExpense} onSuccess={handleEditSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}