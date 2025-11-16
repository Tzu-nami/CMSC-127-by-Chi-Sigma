import { BookOpen, TrendingUp, Users } from 'lucide-react';
import InventoryCard from './inventory-card';

// Variables
interface InventorySummaryProps {
    totalBooks: number;
    activeLoans: number;
    availableCopies: number;
    totalBorrowers: number;
}

export default function InventorySummary({
    totalBooks,
    activeLoans,
    availableCopies,
    totalBorrowers,
}: InventorySummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InventoryCard
                title="Total Books"
                value={totalBooks}
                icon={<BookOpen className="h-6 w-6 text-[#8C9657]"/>}
                color="bg-[#f0f4e8]"
            />
            <InventoryCard
                title="Active Loans"
                value={activeLoans}
                icon={<TrendingUp className="h-6 w-6 text-[#3b82f6]"/>}
                color="bg-[#eff6ff]"
            />
            <InventoryCard
                title="Available Copies"
                value={availableCopies}
                icon={<BookOpen className="h-6 w-6 text-[#10b981]"/>}
                color="bg-[#ecfdf5]"
            />
            <InventoryCard
                title="Total Borrowers"
                value={totalBorrowers}
                icon={<Users className="h-6 w-6 text-[#f59e0b]"/>}
                color="bg-[#fffbeb]"
            />
        </div>
    );
}
