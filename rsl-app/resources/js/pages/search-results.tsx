import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Search Results',
        href: '/search',
    },
];

// column display for each table
const bookColumns = [
    { key: 'BOOK_ID', label: 'Book ID' },
    { key: 'BOOK_TITLE', label: 'Book Title' },
    { key: 'BOOK_YEAR', label: 'Year' },
    { key: 'BOOK_PUBLISHER', label: 'Publisher' },
    { key: 'BOOK_COPIES', label: 'Copies' }
];

const authorColumns = [
    { key: 'AUTHOR_ID', label: 'Author ID' },
    { key: 'AUTHOR_LASTNAME', label: 'Last Name' },
    { key: 'AUTHOR_FIRSTNAME', label: 'First Name' },
    { key: 'AUTHOR_MIDDLEINITIAL', label: 'Middle Initial' }
];

const staffColumns = [
    { key: 'STAFF_ID', label: 'Staff ID' },
    { key: 'STAFF_LASTNAME', label: 'Last Name' },
    { key: 'STAFF_FIRSTNAME', label: 'First Name' },
    { key: 'STAFF_MIDDLEINITIAL', label: 'Middle Initial' }
];

const borrowerColumns = [
    { key: 'BORROWER_ID', label: 'Borrower ID' },
    { key: 'BORROWER_LASTNAME', label: 'Last Name' },
    { key: 'BORROWER_FIRSTNAME', label: 'First Name' },
    { key: 'BORROWER_MIDDLEINITIAL', label: 'Middle Initial' }
];

const transactionColumns = [
    { key: 'TRANSACTION_ID', label: 'Transaction ID' },
    { key: 'TRANSACTION_BORROWDATE', label: 'Borrow Date' },
    { key: 'TRANSACTION_DUEDATE', label: 'Due Date' },
];

const currentloansColumns = [
    { key: 'TRANSACTION_ID', label: 'Transaction ID' },
    { key: 'BOOK_ID', label: 'Book ID' },
    { key: 'BORROWER_ID', label: 'Borrower ID' },
    { key: 'STAFF_ID', label: 'Staff ID' }
];
interface SearchResultsProps {
    query: string;
    books: any[];
    authors: any[];
    staff: any[];
    borrowers: any[];
    transactions: any[];
    currentloans: any[];
}

export default function SearchResults({ query, books, authors, staff, borrowers, transactions, currentloans }: SearchResultsProps) {
    const getInitialTab = () => { // for rendering initial tab based on results
        // changed syntax to (prop || []) bcs white space page if prop is null (query not found)
        if ((books || []).length > 0) return 'books';
        if ((authors || []).length > 0) return 'authors';
        if ((staff || []).length > 0) return 'staff';
        if ((borrowers || []).length > 0) return 'borrowers';
        if ((transactions || []).length > 0) return 'transactions';
        if ((currentloans || []).length > 0) return 'currentloans';
        return 'books'; // fallback
    };

    const [activeTab, setActiveTab] = useState(getInitialTab); // set initial tab based on results. goes to where the result is found
    // function to render table
    const renderTable = (data: any[], columns: { key: string; label: string }[]) => {
        if ((data || []).length === 0) {
            return <p className="text-center text-foreground py-8">No results found</p>;
        }
        // render table
        return (
            <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm text-left">
                    <thead className="bg-foreground text-background rounded-t-lg">
                        <tr>
                            {columns.map(col => <th className="px-6 py-1 font-medium" key={col.key}>{col.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                        <tr key={index}>
                            {columns.map(col => <td className="px-6 py-1 whitespace-nowrap text-foreground" key={col.key}>{row[col.key]}</td>)}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    // main render
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Search Results for "${query}"`} />
            
            <div className="space-y-6">
                <div className="bg-card rounded-lg border border-muted p-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Search Results</h1>
                    <p className="text-foreground dark:text-background">Results for:
                        <span className="font-semibold text-accent">{query}</span>
                    </p>
                </div>
                {/* tabs for different categories */}
                <div className="bg-card rounded-lg p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="books" className="flex-1">
                                Books ({books.length})
                            </TabsTrigger>
                            <TabsTrigger value="authors" className="flex-1">
                                Authors ({authors.length})
                            </TabsTrigger>
                            <TabsTrigger value="staff" className="flex-1">
                                Staff ({staff.length})
                            </TabsTrigger>
                            <TabsTrigger value="borrowers" className="flex-1">
                                Borrowers ({borrowers.length})
                            </TabsTrigger>
                            <TabsTrigger value="transactions" className="flex-1">
                                Transactions ({transactions.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="books" className="space-y-4">
                            {renderTable(books, bookColumns)}
                        </TabsContent>

                        <TabsContent value="authors" className="space-y-4">
                            {renderTable(authors, authorColumns)}
                        </TabsContent>

                        <TabsContent value="staff" className="space-y-4">
                            {renderTable(staff, staffColumns)}
                        </TabsContent>

                        <TabsContent value="borrowers" className="space-y-4">
                            {renderTable(borrowers, borrowerColumns)}
                        </TabsContent>

                        <TabsContent value="transactions" className="space-y-4">
                            {renderTable(transactions, transactionColumns)}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}