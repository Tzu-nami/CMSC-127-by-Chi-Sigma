import React, { useState, useEffect } from 'react';
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

// --- COLUMN DEFINITIONS ---
const bookColumns = [
    { key: 'BOOK_ID', label: 'Book ID' },
    { key: 'BOOK_TITLE', label: 'Book Title' },
    { key: 'BOOK_YEAR', label: 'Year' },
    { key: 'BOOK_PUBLISHER', label: 'Publisher' },
    { key: 'BOOK_COPIES', label: 'Copies' }
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

interface SearchResultsProps {
    query: string;
    authors: any[];
    staff: any[];
    borrowers: any[];
    transactions: any[];
    currentloans: any[]; 
    genres: any[];
    allBooks: any[];
    booksByAuthor: any[];
    booksByGenre: any[];
}

export default function SearchResults({query = '', allBooks = [], authors = [], staff = [], borrowers = [], transactions = [], genres = [], booksByAuthor = [], booksByGenre = [] }: SearchResultsProps) {
    // NAGWWHITE SCREEN KASI bwiset
    const AllBooks = allBooks || [];
    const Authors = authors || [];
    const Staff = staff || [];
    const Borrowers = borrowers || [];
    const Transactions = transactions || [];
    const Genres = genres || [];
    const BooksByAuthor = booksByAuthor || [];
    const BooksByGenre = booksByGenre || [];

    // determine initial tab based on available data
    const getInitialTab = () => { 
        // arranged by priority sino una niya bubuksan
        if (Authors.length > 0) return 'authors';
        if (Genres.length > 0) return 'genres';
        if (AllBooks.length > 0) return 'allBooks';
        if (Staff.length > 0) return 'staff';
        if (Borrowers.length > 0) return 'borrowers';
        if (Transactions.length > 0) return 'transactions';
        return 'allBooks'; // fallback
    };

    const [activeTab, setActiveTab] = useState(getInitialTab); // use function to set initial state

    // useEffect to update active tab if data changes
    useEffect(() => {setActiveTab(getInitialTab());}, [AllBooks, Staff, Borrowers, Transactions, Authors, Genres, query]);
    
    // function to render table
    const renderTable = (data: any[], columns: { key: string; label: string }[]) => {
        // double check data exists
        const realData = data || [];

        if (realData.length === 0) {
            return <p className="text-center text-muted-foreground py-4 italic">No results found</p>;
        }
        return (
            <div className="overflow-x-auto rounded-md border border-muted mt-2">
                <table className="min-w-full divide-y divide-border text-sm text-left">
                    <thead className="bg-foreground text-background rounded-t-lg">
                        <tr>
                            {columns.map(col => <th className="px-6 py-1 font-medium" key={col.key}>{col.label}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                        {realData.map((row, index) => (
                        <tr key={index} className="hover:bg-muted/50 transition-colors">
                            {columns.map(col => <td className="px-6 py-3 whitespace-nowrap text-foreground" key={col.key}>{row[col.key]}</td>)}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // display
    const renderContent = () => {
        // handling collision of scenarios: author found and borrower or staff found
        return (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rounded-sm">
                <div className="overflow-x-auto pb-2">
                    <TabsList className="inline-flex h-auto w-full justify-start gap-2 bg-transparent p-0">
                        {/* scenario 1: standard triggers */}
                        <TabsTrigger value="allBooks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-input bg-background px-4 py-2">
                            All Books ({AllBooks.length})
                        </TabsTrigger>
                        {/* scenario 2: author found triggers */}
                        {Authors.length > 0 && (
                            <TabsTrigger value="authors" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-input bg-background px-4 py-2">
                                Author ({Authors.length})
                            </TabsTrigger>
                        )}
                        {/* scenario 3: genre found triggers */}
                        {Genres.length > 0 && (
                            <TabsTrigger value="genres" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-input bg-background px-4 py-2">
                                Genre ({Genres.length})
                            </TabsTrigger>
                        )}
                        <TabsTrigger value="staff" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-input bg-background px-4 py-2">
                            Staff ({Staff.length})
                        </TabsTrigger>
                        <TabsTrigger value="borrowers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-input bg-background px-4 py-2">
                            Borrowers ({Borrowers.length})
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-input bg-background px-4 py-2">
                            Transactions ({Transactions.length})
                        </TabsTrigger>                     
                    </TabsList>
                </div>

                {/* --- CONTENT AREAAAAA RAGHHHHHHHH --- */}

                {/* scenario 1 content: author found, print books too */}
                <TabsContent value="authors" className="mt-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-muted/10 rounded-lg p-6 shadow-sm">
                        <h2 className="text-2xl font-bold text-accent mb-1">Author Found</h2>
                        <div className="bg-card rounded-md border p-4 space-y-2">
                            {Authors.map((author) => (
                                <div key={author.AUTHOR_ID}>
                                    <h3 className="text-xl font-bold">{author.AUTHOR_FIRSTNAME} {author.AUTHOR_LASTNAME}</h3>
                                    <p className="text-sm text-muted-foreground">Author ID: {author.AUTHOR_ID}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                            Books by {Authors[0]?.AUTHOR_FIRSTNAME} {Authors[0]?.AUTHOR_LASTNAME}
                        </h3>
                        {renderTable(BooksByAuthor, bookColumns)}
                    </div>
                </TabsContent>

                {/* scenario 2 content: genre found, print books under that genre */}
                <TabsContent value="genres" className="mt-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-muted/10 shadow-sm rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-accent mb-1">Genre Found</h2>
                        <div className="bg-card rounded-md border p-4 space-y-2">
                            {Genres.map((genre) => (
                                <div key={genre.GENRE_ID}>
                                    <h3 className="text-xl font-bold capitalize">{genre.GENRE_NAME}</h3>
                                    <p className="text-sm text-muted-foreground">Location: {genre.GENRE_LOCATION}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                            Books in {Genres[0]?.GENRE_NAME}
                        </h3>
                        {renderTable(BooksByGenre, bookColumns)}
                    </div>
                </TabsContent>

                {/* standard content */}
                <TabsContent value="allBooks" className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h2 className="text-2xl font-bold text-accent mb-1">Books Found</h2>
                    {renderTable(AllBooks, bookColumns)}
                </TabsContent>
                <TabsContent value="staff" className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h2 className="text-2xl font-bold text-accent mb-1">Staff Found</h2>
                    {renderTable(Staff, staffColumns)}
                </TabsContent>
                <TabsContent value="borrowers" className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h2 className="text-2xl font-bold text-accent mb-1">Borrowers Found</h2>
                    {renderTable(Borrowers, borrowerColumns)}
                </TabsContent>
                <TabsContent value="transactions" className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h2 className="text-2xl font-bold text-accent mb-1">Transactions Found</h2>
                    {renderTable(Transactions, transactionColumns)}
                </TabsContent>
            </Tabs>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Search: ${query}`} />
            
            <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-card rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Search Results</h1>
                    <p className="text-muted-foreground">For: <span className="font-semibold text-accent">"{query}"</span></p>
                </div>

                <div className="bg-card rounded-lg border border-border p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {renderContent()}
                </div>
            </div>
        </AppLayout>
    );
}