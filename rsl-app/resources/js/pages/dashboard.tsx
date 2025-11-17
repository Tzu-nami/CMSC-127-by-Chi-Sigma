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

export function Calendar18() {
  return (
    <Calendar
        mode="single"
        defaultMonth={new Date()}
        //selected={date}
        //onSelect={setDate}
        classNames={{day: "pointer-events-none"}}
        className="rounded-lg bg-card [--cell-size:--spacing(3)] md:[--cell-size:--spacing(7)]"
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
            
            <div className="space-y-4 px-4 sm:px-6 lg:px-8">
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
                <div className="grid lg:grid-cols-6 gap-3.5 items-center">
                    {/* left column */}
                    <div className="bg-card rounded-lg border border-muted p-6 col-span-1">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="flex flex-col gap-3 justify-self-center">
                            {/* CreateModalForm component instances. i will fix the layout later my brain is fried*/}

                            {/* quick actions subrow1: transaction*/}
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-foreground w-20">New Loan:</p>
                                <CreateModalForm 
                                    title="Add New Current Loan"
                                    route="/currentloansdatabase"
                                    fields={[
                                        { name: "transaction_id", label: "Transaction ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5 },
                                        { name: "book_id", label: "Book ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5 },
                                        { name: "borrower_id", label: "Borrower ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5 },
                                        { name: "staff_id", label: "Staff ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5}
                                    ]}
                                />
                            </div>

                            {/* quick actions subrow 2: book */}
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-foreground w-20">Book:</p>
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
                            </div>

                            {/* quick actions subrow 3: author */}
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-foreground w-20">Author:</p>
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
                            </div>
                            
                            {/* quick actions subrow 4: borrower */}
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-foreground w-20">Borrower:</p>
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
                            </div>

                            {/* quick actions subrow 5: staff */}
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-foreground w-20">Staff:</p>
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
                    </div>

                    {/* middle column */}       
                    <div className="col-span-4">
                        <RecentTransactions transactions={recentTransactions} />
                    </div>

                    {/* right column */}
                    <div className="col-span-1">
                        <Calendar18/>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}