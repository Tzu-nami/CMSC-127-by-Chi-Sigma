import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import SearchBar from '@/components/search-bar';
import InventorySummary from '@/components/inventory-summary';
import { Calendar } from "@/components/ui/calendar"
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

export function Calendar18() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 10, 16)
  )
  return (
    <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg bg-card [--cell-size:--spacing(8)] md:[--cell-size:--spacing(8)]"
        buttonVariant="ghost"
    />
  )
}

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
            
            <div className="space-y-6 px-4 sm:px-6 lg:px-8">
                <div className="justify-items-center pt-8 pb-3">
                    <p className="text-3xl font-bold text-foreground">Welcome to the MKNS School Library Management System.</p>
                </div>

                {/* -- ROW 1 : search bar -- */}
                <div className="bg-card rounded-lg">
                    <SearchBar onSearch={handleGlobalSearch} />
                </div>

                {/* -- ROW 2 : inventory summary -- */}
                <InventorySummary
                    totalBooks={stats.totalBooks}
                    activeLoans={stats.activeLoans}
                    availableCopies={stats.availableCopies}
                    totalBorrowers={stats.totalBorrowers}
                />
                
                {/* -- ROW 3 : transactions & calendar & quick actions (3 columns) -- */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-5 items-center">
                    {/* left column */}
                    <div className="bg-card rounded-lg border border-muted p-6 col-span-1">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            {/* CreateModalForm component instances. i will fix the layout later my brain is fried*/}
                            <p className="text-sm text-foreground">Transaction:</p>
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
                            <p className="text-sm text-foreground">Book:</p>
                            <CreateModalForm 
                                title="Add New Book"
                                route="/booksdatabase"
                                fields={[
                                    { name: "book_id", label: "Book ID", type:"text", placeholder: "e.g. A1Z26" , required: true, maxLength: 5 },
                                    { name: "book_title", label: "Book Title", type:"text", placeholder: "Enter Book Title", required: true, maxLength: 255 },
                                    { name: "book_year", label: "Book Year", type:"number", placeholder: "Enter Book Year", required: true, maxLength: 4, pattern: "[0-9]*" },
                                    { name: "book_publisher", label: "Book Publisher", type:"text", placeholder: "Enter Book Publisher", required: true, maxLength: 255 },
                                    { name: "book_copies", label: "Number of Copies", type:"number", placeholder: "Enter number of copies", required: true, maxLength: 5, pattern: "[0-9]*" },
                                ]}
                            />
                            <p className="text-sm text-foreground">Author:</p>
                            <CreateModalForm 
                                title="Add New Author"
                                route="/authorsdatabase"
                                fields={[
                                    { name: "author_id", label: "Author ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5 },
                                    { name: "author_lastname", label: "Last Name", type:"text", placeholder: "Enter Last Name", required: true, maxLength: 255, pattern: "[^0-9]*" },
                                    { name: "author_firstname", label: "First Name", type:"text", placeholder: "Enter First Name", required: true, maxLength: 255, pattern: "[^0-9]*" },
                                    { name: "author_middleinitial", label: "Middle Initial", type:"text", placeholder: "Enter Middle Initial", required: false, maxLength: 2, pattern: "[^0-9]*"}
                                ]}
                            />
                            <p className="text-sm text-foreground">Borrower:</p>
                            <CreateModalForm 
                                title="Add New Borrower"
                                route="/borrowersdatabase"
                                fields={[
                                    { name: "borrower_id", label: "Borrower ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5 },
                                    { name: "borrower_lastname", label: "Last Name", type:"text", placeholder: "Enter Last Name", required: true, maxLength: 255, pattern: "[^0-9]*" },
                                    { name: "borrower_firstname", label: "First Name", type:"text", placeholder: "Enter First Name", required: true, maxLength: 255, pattern: "[^0-9]*" },
                                    { name: "borrower_middleinitial", label: "Middle Initial", type:"text", placeholder: "Enter Middle Initial", required: false, maxLength: 2, pattern: "[^0-9]*" },
                                    { name: "borrower_status", label: "Choose a status", type:"text", placeholder: "Enter a status", required: true, maxLength: 100 },
                                    { name: "borrower_contactnumber", label: "Contact Number", type:"text", placeholder: "Enter Contact Number", required: true, maxLength: 15, pattern: "[0-9+-]*"},
                                ]}
                            />
                            <p className="text-sm text-foreground">Staff:</p>
                            <CreateModalForm 
                                title="Add New Staff"
                                route="/staffdatabase"
                                fields={[
                                    { name: "staff_id", label: "Staff ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5 },
                                    { name: "staff_lastname", label: "Last Name", type:"text", placeholder: "Enter Last Name", required: true, maxLength: 255, pattern: "[^0-9]*" },
                                    { name: "staff_firstname", label: "First Name", type:"text", placeholder: "Enter First Name", required: true, maxLength: 255, pattern: "[^0-9]*" },
                                    { name: "staff_middleinitial", label: "Middle Initial", type:"text", placeholder: "Enter Middle Initial", required: false, maxLength: 2, pattern: "[^0-9]*" },
                                    { name: "staff_job", label: "Choose a job", type:"text", placeholder: "Enter a job", required: true, maxLength: 100},
                                ]}
                            />
                        </div>
                    </div>

                    {/* middle column */}       
                    <div className="col-span-4">
                        <RecentTransactions transactions={recentTransactions} />
                    </div>

                    {/* right column */}
                    <div className="col-span-1">
                        <Calendar18 />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}