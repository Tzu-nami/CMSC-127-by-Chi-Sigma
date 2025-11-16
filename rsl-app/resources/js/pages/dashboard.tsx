import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import SearchBar from '@/components/search-bar';
import InventorySummary from '@/components/inventory-summary';
import CalendarWidget from '@/components/calendar-widget';
import QuickTransactionForm from '@/components/quick-transaction-form';
import RecentTransactions from '@/components/recent-transactions';
import { CreateModalForm } from '@/components/create-modal-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'icon';
    children: React.ReactNode;
}

const Button = ({ variant = 'default', size = 'default', className = '', children, ...props }: ButtonProps) => {
    const variants = {
        default: 'bg-[#8C9657] text-[#ffffff] hover:bg-[#444034]',
        outline: 'border border-[#d1d5db] bg-[#ffffff] text-[#374151] hover:bg-[#f9fafb]',
        ghost: 'bg-[transparent] text-[#374151] hover:bg-[#444034]',
    };
    const sizes = {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        icon: 'h-9 w-9',
    };
    const classes = `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;
    return <button className={classes} {...props}>{children}</button>;
};

// --- MAIN DASHBOARD PAGE ---
export default function Dashboard({
    stats,
    recentTransactions,
}: {
    stats: {
        totalBooks: number;
        activeLoans: number;
        availableCopies: number;
        totalBorrowers: number;
    };
    recentTransactions: any[];
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleGlobalSearch = (query: string) => {
        if (query.trim()) {
            router.get('/search', { q: query });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                <div className="bg-card rounded-lg border border-muted p-6">
                    <SearchBar onSearch={handleGlobalSearch} />
                </div>

                <InventorySummary
                    totalBooks={stats.totalBooks}
                    activeLoans={stats.activeLoans}
                    availableCopies={stats.availableCopies}
                    totalBorrowers={stats.totalBorrowers}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">                    
                    <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <CreateModalForm
                                title="Add New Transaction"
                                route="/transactionsdatabase"
                                fields={[
                                    { name: "transaction_id", label: "Transaction ID", type: "text", placeholder: "e.g. A1Z26", required: true, maxLength: 5 },
                                    { name: "book_id", label: "Book ID", type: "text", placeholder: "e.g. B1Y25", required: true, maxLength: 5 },
                                    { name: "borrower_id", label: "Borrower ID", type: "text", placeholder: "e.g. C1X24", required: true, maxLength: 5 },
                                    { name: "staff_id", label: "Staff ID", type: "text", placeholder: "e.g. D1W23", required: true, maxLength: 5 }
                                ]}
                            />
                            <Button variant="outline" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                View All Books
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                View All Borrowers
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <CalendarWidget/>
                    </div>
                </div>

                <RecentTransactions transactions={recentTransactions} />
            </div>
        </AppLayout>
    );
}