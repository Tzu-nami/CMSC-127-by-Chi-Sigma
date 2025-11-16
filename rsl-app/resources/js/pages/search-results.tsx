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

interface SearchResultsProps {
    query: string;
    books: any[];
    authors: any[];
    staff: any[];
    borrowers: any[];
    transactions: any[];
}

export default function SearchResults({ query, books, authors, staff, borrowers, transactions }: SearchResultsProps) {
    const getInitialTab = () => {
        if (books.length > 0) return 'books';
        if (authors.length > 0) return 'authors';
        if (staff.length > 0) return 'staff';
        if (borrowers.length > 0) return 'borrowers';
        if (transactions.length > 0) return 'transactions';
        return 'books'; // fallback
    };

    const [activeTab, setActiveTab] = useState(getInitialTab); // set initial tab based on results. goes to where the result is found

    const renderTable = (data: any[], columns: string[]) => {
        if (data.length === 0) {
            return <p className="text-center text-foreground py-8">No results found</p>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm text-left rounded-b-lg">
                    <thead className="bg-foreground">
                        <tr>
                            {columns.map((col, index) => (
                                <th 
                                    key={col} 
                                    className={`
                                        px-4 py-2 border-b text-background
                                        ${index === 0 ? 'rounded-tl-lg' : ''}
                                        ${index === columns.length - 1 ? 'rounded-tr-lg' : ''}
                                    `}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-muted">
                                {columns.map((col) => (
                                    <td key={col} className="px-4 py-2 border-b text-foreground whitespace-nowrap">
                                        {item[col]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Search Results for "${query}"`} />
            
            <div className="space-y-6">
                <div className="bg-card rounded-lg border border-muted p-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Search Results</h1>
                    <p className="text-foreground dark:text-background">Results for: <span className="font-semibold text-accent">{query}</span></p>
                </div>

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
                            {renderTable(books, ['BOOK_ID', 'BOOK_TITLE', 'BOOK_YEAR', 'BOOK_PUBLISHER', 'BOOK_COPIES'])}
                        </TabsContent>

                        <TabsContent value="authors" className="space-y-4">
                            {renderTable(authors, ['AUTHOR_ID', 'AUTHOR_LASTNAME', 'AUTHOR_FIRSTNAME', 'AUTHOR_MIDDLEINITIAL'])}
                        </TabsContent>

                        <TabsContent value="staff" className="space-y-4">
                            {renderTable(staff, ['STAFF_ID', 'STAFF_LASTNAME', 'STAFF_FIRSTNAME', 'STAFF_MIDDLEINITIAL'])}
                        </TabsContent>

                        <TabsContent value="borrowers" className="space-y-4">
                            {renderTable(borrowers, ['BORROWER_ID', 'BORROWER_LASTNAME', 'BORROWER_FIRSTNAME', 'BORROWER_CONTACTNUMBER', 'BORROWER_STATUS'])}
                        </TabsContent>

                        <TabsContent value="transactions" className="space-y-4">
                            {renderTable(transactions, ['TRANSACTION_ID', 'TRANSACTION_BORROWDATE', 'TRANSACTION_DUEDATE'])}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}