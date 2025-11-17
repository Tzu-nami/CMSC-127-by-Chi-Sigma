import React,{ useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router} from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions Database',
        href: '/transactionsdatabase',
    },
];
import {
    Search as SearchIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from 'lucide-react';

import { CreateModalForm } from '@/components/create-modal-form';
import { EditModalForm } from '@/components/ui/edit-modal-form';
import { DeleteForm } from '@/components/ui/delete-form';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'icon';
    children: React.ReactNode;
}

const Button = ({ variant = 'default', size = 'default', className = '', children, ...props }: ButtonProps) => {
    const variants = {
        default: 'bg-[#8C9657] text-[#ffffff] hover:bg-[#444034]',
        outline: 'border border-[#d1d5db] bg-[#ffffff] text-[#374151] hover:bg-[#f9fafb] hover:text-[#444034]',
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

// --- Pagination Component ---
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


// --- MAIN PAGE COMPONENT ---
export default function TransactionsDatabaseIndex( {transactions, filters}: { transactions: any[], filters:{search?: string}} ) {

    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    {/*-- Pagination --*/}
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Fixed items per page


    useEffect(() =>{
            const timerId = setTimeout(() => {
                if (searchTerm === (filters.search || '')) {
                    return;
                }
    
                router.get(
                    '/transactionsdatabase',
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
            setCurrentPage(1); // Reset to first page on filter change
        }, [searchTerm]);

        // Filter borrowers based on search term
        const filteredTransactions = transactions.filter((transaction) => {
            const search = searchTerm.toLowerCase();
            return (
                transaction.TRANSACTION_ID.toLowerCase().includes(search) ||
                transaction.TRANSACTION_BORROWDATE.toLowerCase().includes(search) ||
                transaction.TRANSACTION_DUEDATE.toLowerCase().includes(search)
            );
        }   );

        // Pagination logic
        const totalItems = filteredTransactions.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginatedTransactions = filteredTransactions.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        const handlePageChange = (page: number) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
        };  

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions Database" />

            <div className="bg-[#FFFDF6] shadow-sm rounded-lg overflow-hidden">
                
                <div className="p-4 sm:p-6 border-b border-[#e5e7eb]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        
                        <div className="relative w-full md:max-w-md">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                            <Input
                                placeholder="Search by name, ID, contact number..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        </div>
                    </div>
                </div>

                {/*Display header of table*/}
                <div className="p-6 overflow-x-auto">
                    <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm   rounded-b-lg">
                        <thead className="bg-foreground">
                            <tr>
                                <th className="px-4 py-2 border-b text-background text-center   rounded-tl-lg">Transaction ID</th>
                                <th className="px-4 py-2 border-b text-background text-center  ">Transaction Borrow Date</th>
                                <th className="px-4 py-2 border-b text-background text-center  ">Transaction Due Date</th>
                                <th className="px-2 py-2 border-b text-background text-center   rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>

                    {/*Display data of table using map function in the array, index for future null values*/}
                        <tbody> 
                        {paginatedTransactions && paginatedTransactions.length > 0 ? (
                            paginatedTransactions.map((transaction, index) => (
                            <tr key={transaction.TRANSACTION_ID || `transactions-${index}`} className="hover:bg-muted">
                                        <td className="px-4 py-2 border-b text-foreground  whitespace-nowrap text-center">{transaction.TRANSACTION_ID}</td>
                                        <td className="px-4 py-2 border-b text-foreground  whitespace-nowrap text-center">{transaction.TRANSACTION_BORROWDATE}</td>
                                        <td className="px-4 py-2 border-b text-foreground  whitespace-nowrap text-center">{transaction.TRANSACTION_DUEDATE}</td>
                                        <td className="text-center">
                                            <div className="flex justify-center space-x-1">
                                                <EditModalForm 
                                                    title="Edit Transaction"
                                                    triggerVariant="outline"
                                                    route={`/transactionsdatabase/${transaction.TRANSACTION_ID}`}
                                                    initialData={{
                                                        transaction_id: transaction.TRANSACTION_ID,
                                                        transaction_borrowdate: transaction.TRANSACTION_BORROWDATE,
                                                        transaction_duedate: transaction.TRANSACTION_DUEDATE,
                                                    }}
                                                    fields={[
                                                        { name: "transaction_id", label: "Transaction ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, readonly: true },
                                                        { name: "transaction_borrowdate", label: "Date Borrowed", type:"date", placeholder: "", required: true },
                                                        { name: "transaction_duedate", label: "Due Date", type:"date", placeholder: "", required: true, autoCalculate: {
                                                            basedOn: "transaction_borrowdate",
                                                            addDays: 7
                                                        }}
                                                    ]}
                                                />
                                                <DeleteForm
                                                    route={`/transactionsdatabase/${transaction.TRANSACTION_ID}`}
                                                    item={`Transaction: ${transaction.TRANSACTION_ID}`}
                                                    triggerVariant="outline"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-500">
                                        {}
                                        {filters.search ? 'No transactions found for your search.' : 'No transactions found.'}
                                    </td> 
                                </tr>

                            )}
                        </tbody>
                    </table>
                </div>

            <div className="p-4 sm:p-6 border-t border-[#e5e7eb]">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                />
            </div>

            </div>
        </AppLayout>
    );
}

