"use client"

import React,{ useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

import {
    Search as SearchIcon,
    SlidersHorizontal as SlidersHorizontalIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from 'lucide-react';

import { CreateModalForm } from '@/components/create-modal-form';
import { EditModalForm } from '@/components/ui/edit-modal-form';
import { DeleteForm } from '@/components/ui/delete-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books Database',
        href: '/booksdatabase',
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
    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
    return (
        <input
            className={`flex h-9 w-full rounded-md border border-[#d1d5db] bg-[transparent] px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8C9657] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            ref={ref}
            {...props}
        />
    );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode };

const Select = ({ className = '', children, ...props }: SelectProps) => {
    return (
        <select
            className={`flex h-9 w-full items-center justify-between rounded-md border border-[#d1d5db] bg-[#ffffff] px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-[#6b7280] focus:outline-none focus:ring-1 focus:ring-[#8C9657] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};

interface Tab {
    name: string;
}
interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabName: string) => void;
}

const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => (
    <div className="border-b border-[#e5e7eb]">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.name}
                    onClick={() => onTabChange(tab.name)}
                    className={`${tab.name === activeTab
                        ? 'border-[#8C9657] text-[#8C9657]'
                        : 'border-[transparent] text-[#6b7280] hover:text-[#374151] hover:border-[#d1d5db]'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    {tab.name}
                </button>
            ))}
        </nav>
    </div>
);

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between border-t border-[#e5e7eb] px-4 py-3 sm:px-6">
            <div className="text-sm text-[#6b7280]">
                Showing {startItem} to {endItem} of {totalItems} results
            </div>
            <div className="flex space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm text-[#6b7280]">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

{/*-- MAIN PAGE COMPONENT --*/}
export default function BooksIndex({ books, filters }: { books: any[], filters:{search?: string} }) {
    const tabOptions: Tab[] = [
        { name: 'All Books' },
        { name: 'Available' },
        { name: 'On Loan' },
    ];

    {/*-- Search --*/}  
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    {/*-- Tab --*/} 
    const [activeTab, setActiveTab] = useState<string>('All Books');
    {/*-- Filters --*/}
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [yearFilter, setYearFilter] = useState('');
    const [publisherFilter, setPublisherFilter] = useState('');
    {/*-- Sort --*/}
    const [sortBy, setSortBy] = useState("title-asc");  
    {/*-- Pagination --*/}
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Fixed items per page

    useEffect(() =>{
        const timerId = setTimeout(() => {
            if (searchTerm === (filters.search || '')) {
                return;
            }

            router.get(
                '/booksdatabase',
                {search: searchTerm},
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }, 300);
        return () => clearTimeout(timerId);
    }, [searchTerm,filters.search]);

    useEffect(() => {
        setSearchTerm(filters.search || '');
    }, [filters.search]);

    useEffect(() => {
        // change to page 1 whenever filters or tab change
        setCurrentPage(1);
    }, [searchTerm, activeTab, yearFilter, publisherFilter]);

    const getFilteredAndSortedBooks = () => {
        let filtered = books;
        
        {/*-- Search Term --*/}
        if (searchTerm) {
            filtered = filtered.filter(
                (book) =>
                book.BOOK_TITLE.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.BOOK_PUBLISHER.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        {/*-- Active Tabs --*/}
        if (activeTab === 'Available') {
            filtered = filtered.filter((book) => book.BOOK_COPIES > 0);
        } // idk how to do the on loan yet

        {/*-- Year Filter --*/}
        if (yearFilter) {
            filtered = filtered.filter((book => book.BOOK_YEAR.toString() === yearFilter))
        }

        {/*-- Publisher Filter --*/}
        if (yearFilter) {
            filtered = filtered.filter((book => book.BOOK_YEAR.toString() === yearFilter))
        }

        if (publisherFilter) {
            filtered = filtered.filter((book => book.BOOK_PUBLISHER.toString() === publisherFilter))
        }
        
        {/*-- Sort --*/}
        switch (sortBy) {
            case "title-asc":
                filtered.sort((a, b) => a.BOOK_TITLE.localeCompare(b.BOOK_TITLE))
                break
            case "title-desc":
                filtered.sort((a, b) => b.BOOK_TITLE.localeCompare(a.BOOK_TITLE))
                break
            case "year-newest":
                filtered.sort((a, b) => b.BOOK_YEAR - a.BOOK_YEAR)
                break
            case "year-oldest":
                filtered.sort((a, b) => a.BOOK_YEAR - b.BOOK_YEAR)
                break
            case "copies-available":
                filtered.sort((a, b) => b.BOOK_COPIES - a.BOOK_COPIES)
                break
            default:
                break
        }
        return filtered;
    }

    {/*-- Get unique years and publishers --*/}
    const uniqueYears = Array.from(new Set(books.map(book => book.BOOK_YEAR))).sort((a, b) => b - a);
    const uniquePublishers = Array.from(new Set(books.map(book => book.BOOK_PUBLISHER))).sort();

    {/*-- pagination --*/}
    const filteredbooks = getFilteredAndSortedBooks();
    const totalItems = filteredbooks.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedBooks = filteredbooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Books Database" />
        <div className="bg-[#ffffff] shadow-sm rounded-lg overflow-hidden">

            <div className="p-4 sm:p-6 border-b border-[#e5e7eb]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative w-full md:max-w-md">
                        {/*-- Search Input --*/}
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                        
                        <Input 
                            placeholder="Search by title, author, publisher..." 
                            className="pl-9"
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>

                    {/*-- Filters --*/}
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowMoreFilters(!showMoreFilters)}>
                        <SlidersHorizontalIcon className="h-4 w-4 mr-2" />
                        More Filters
                    </Button>

                    {/*-- Add New Book Modal --*/}
                    <div className="w-full sm:w-auto">
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
                    </div>
                </div>
            </div>
            
            {/*-- Filters section --*/}
            {showMoreFilters && (
                <div className="px-4 sm:px-6 py-4 bg-[#f9fafb] border-b border-[#e5e7eb] flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-[#374151] mb-2">Year Published</label>
                        <Select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                            <option value="">All Years</option>
                            {uniqueYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                            ))}
                        </Select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-[#374151] mb-2">Publisher</label>
                        <Select value={publisherFilter} onChange={(e) => setPublisherFilter(e.target.value)}>
                            <option value="">All Publishers</option>
                            {uniquePublishers.map((publisher) => (
                            <option key={publisher} value={publisher}>
                                {publisher}
                            </option>
                            ))}
                        </Select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-[#374151] mb-2">Sort By</label>
                        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="title-asc">Title (A-Z)</option>
                            <option value="title-desc">Title (Z-A)</option>
                            <option value="year-newest">Year (Newest)</option>
                            <option value="year-oldest">Year (Oldest)</option>
                            <option value="copies-available">Most Copies Available</option>
                        </Select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                            setYearFilter("")
                            setPublisherFilter("")
                            setSortBy("title-asc")
                            }}
                            className="w-full"
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>
            )}
            
            <div className="px-4 sm:px-6">
                <Tabs tabs={tabOptions} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/*-- Display header of table --*/}
            <div className="p-6 overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm text-left rounded-b-lg">
                <thead className="bg-foreground">
                <tr>
                    <th className="px-4 py-2 border-b text-background rounded-tl-lg">Book ID</th>
                    <th className="px-4 py-2 border-b text-background">Title</th>
                    <th className="px-4 py-2 border-b text-background">Year Published</th>
                    <th className="px-4 py-2 border-b text-background">Publisher</th>
                    <th className="px-4 py-2 border-b text-background">Available Copies</th>
                    <th className="px-4 py-2 border-b text-background rounded-tr-lg text-center" colSpan={2}>Actions</th>
                </tr>
                </thead>

                {/*-- Display data of table using map function in the array, index for future null values. Filtered function applied. --*/}
                <tbody>
                {/*-- changed to paginatedBooks --*/}
                {paginatedBooks && paginatedBooks.length > 0 ? ( 
                    paginatedBooks.map((book, index) => (
                        <tr key={book.BOOK_ID || `book-${index}`} className="hover:bg-muted">
                            <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{book.BOOK_ID}</td>
                            <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{book.BOOK_TITLE}</td>
                            <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{book.BOOK_YEAR}</td>
                            <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{book.BOOK_PUBLISHER}</td>
                            <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">
                                <span className={book.BOOK_COPIES > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                    {book.BOOK_COPIES}
                                </span>
                            </td>
                            <td>
                                <EditModalForm 
                                    title="Edit Book"
                                    triggerVariant="outline"
                                    route={`/booksdatabase/${book.BOOK_ID}`}
                                    initialData={{
                                        book_id: book.BOOK_ID,
                                        book_title: book.BOOK_TITLE,
                                        book_year: book.BOOK_YEAR,
                                        book_publisher: book.BOOK_PUBLISHER,
                                        book_copies: book.BOOK_COPIES,
                                    }}
                                    fields={[
                                        { name: "book_id", label: "Book ID", type:"text", required: false, maxLength: 5, readonly: true },
                                        { name: "book_title", label: "Book Title", type:"text", required: true, maxLength: 255},
                                        { name: "book_year", label: "Book Year", type:"number", required: true, maxLength: 4 },
                                        { name: "book_publisher", label: "Book Publisher", type:"text", required: true, maxLength: 255 },
                                        { name: "book_copies", label: "Number of Copies", type:"number", required: true, maxLength: 5 },
                                    ]}
                                />
                            </td>
                            <td>
                                <DeleteForm 
                                    route={`/booksdatabase/${book.BOOK_ID}`}
                                    item={`Book: ${book.BOOK_TITLE}`}
                                    triggerVariant="outline"
                                />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500">
                            {filteredbooks.length === 0 && (searchTerm || yearFilter || publisherFilter)
                            ? "No books found matching your criteria."
                            : "No books in the database."}      
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>

            {/*-- Pagination --*/}
            <div className="p-4 sm:p-6 border-t border-[#e5e7eb]">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </AppLayout>
    );
}

