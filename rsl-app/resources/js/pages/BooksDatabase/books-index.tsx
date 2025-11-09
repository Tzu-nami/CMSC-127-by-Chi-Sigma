import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import {
    Search as SearchIcon,
    SlidersHorizontal as SlidersHorizontalIcon,
    Plus as PlusIcon,
} from 'lucide-react';

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
    return <button className={classes} {...props}>{children}</button>;
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


// --- MAIN PAGE COMPONENT ---
export default function BooksIndex({ books }: { books: any[] }) {
    const tabOptions: Tab[] = [
        { name: 'All Books' },
        { name: 'Available' },
        { name: 'On Loan' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Books Database" />
        <div className="bg-[#ffffff] shadow-sm rounded-lg overflow-hidden">

            <div className="p-4 sm:p-6 border-b border-[#e5e7eb]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative w-full md:max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                <Input placeholder="Search by title, author, publisher..." className="pl-9" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Select className="w-full sm:w-auto">
                    <option value="all">All Authors</option>
                </Select>
                <Button variant="outline" className="w-full sm:w-auto">
                    <SlidersHorizontalIcon className="h-4 w-4 mr-2" />
                    More Filters
                </Button>
                <Button className="w-full sm:w-auto">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Book
                </Button>
                </div>
            </div>
            </div>

            
            <div className="px-4 sm:px-6">
            <Tabs tabs={tabOptions} activeTab="All Books" onTabChange={() => {}} />
            </div>

            {/*Display header of table*/}
            <div className="p-6 overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 border-b text-black">Book ID</th>
                    <th className="px-4 py-2 border-b text-black">Title</th>
                    <th className="px-4 py-2 border-b text-black">Year Published</th>
                    <th className="px-4 py-2 border-b text-black">Publisher</th>
                    <th className="px-4 py-2 border-b text-black">Available Copies</th>
                </tr>
                </thead>

                {/*Display data of table using map function in the array, index for future null values*/}
                <tbody>
                {books && books.length > 0 ? (
                    books.map((book, index) => (
                    <tr key={book.BOOK_ID || `book-${index}`} className="hover:bg-green-50 text-black-800">
                        <td className="px-4 py-2 border-b text-black">{book.BOOK_ID}</td>
                        <td className="px-4 py-2 border-b text-black">{book.BOOK_TITLE}</td>
                        <td className="px-4 py-2 border-b text-black">{book.BOOK_YEAR}</td>
                        <td className="px-4 py-2 border-b text-black">{book.BOOK_PUBLISHER}</td>
                        <td className="px-4 py-2 border-b text-black">{book.BOOK_COPIES}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                        No books found.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
        </AppLayout>
    );
}

