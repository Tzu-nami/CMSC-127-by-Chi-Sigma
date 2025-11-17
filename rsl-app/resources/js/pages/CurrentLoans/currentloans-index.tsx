import React,{ useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router} from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Current Loans Database',
        href: '/currentloans',
    },
];
import {
    Search as SearchIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from 'lucide-react';

import { CreateModalForm } from '@/components/create-modal-form';
import { EditModalForm } from '@/components/ui/edit-modal-form';

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

interface Book {
    BOOK_ID: string;
    BOOK_TITLE: string;
    BOOK_COPIES: number;
}

interface Borrower {
    BORROWER_ID: string;
    BORROWER_FIRSTNAME: string;
    BORROWER_LASTNAME: string;
}

interface Staff {
    STAFF_ID: string;
    STAFF_FIRSTNAME: string;
    STAFF_LASTNAME: string;
}

interface CurrentLoan {
    TRANSACTION_ID: string;
    TRANSACTION_BORROWDATE: string;
    TRANSACTION_DUEDATE: string;
    BOOK_ID: string;
    BORROWER_ID: string;
    STAFF_ID: string;
}

interface Props {
    currentLoans: CurrentLoan[];
    books: Book[];
    borrowers: Borrower[];
    staff: Staff[];
    filters: {
        search ?: string;
    }
}

// --- MAIN PAGE COMPONENT ---
export default function CurrentLoansIndex( {currentLoans, books, borrowers, staff, filters}: Props) {

    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const getBook = (bookId: string) => {
        const book = books.find(b => b.BOOK_ID === bookId);
        return book ? book.BOOK_TITLE: bookId;
    };

    const getBorrower = (borrowerId: string) => {
        const borrower = borrowers.find(b => b.BORROWER_ID === borrowerId);
        return borrower ? `${borrower.BORROWER_LASTNAME}, ${borrower.BORROWER_FIRSTNAME}`: borrowerId;
    };

    const getStaff = (staffId: string) => {
        const staffMem = staff.find(b => b.STAFF_ID === staffId);
        return staffMem ? `${staffMem.STAFF_LASTNAME}, ${staffMem.STAFF_FIRSTNAME}`: staffId;;
    };

    const bookOptions = books.map(book => ({
        value: book.BOOK_ID,
        label: `${book.BOOK_TITLE} -- ID: ${book.BOOK_ID} -- ${book.BOOK_COPIES} ${book.BOOK_COPIES === 1 ? 'copy' : 'copies'} available`,
    }));

    const borrowerOptions = borrowers.map(borrower => ({
        value: borrower.BORROWER_ID,
        label: `${borrower.BORROWER_LASTNAME}, ${borrower.BORROWER_FIRSTNAME} -- ID: ${borrower.BORROWER_ID}`,
    }));

    const staffOptions = staff.map(staff => ({
        value: staff.STAFF_ID,
        label: `${staff.STAFF_LASTNAME}, ${staff.STAFF_FIRSTNAME} -- ID: ${staff.STAFF_ID}`,
    }));

    {/*-- Pagination --*/}
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Fixed items per page


    useEffect(() =>{
            const timerId = setTimeout(() => {
                if (searchTerm === (filters.search || '')) {
                    return;
                }
    
                router.get(
                    '/currentloans',
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
        const filteredCurrentLoans = currentLoans.filter((loan) => {
            const search = searchTerm.toLowerCase();
            return (
                loan.TRANSACTION_ID.toLowerCase().includes(search) ||
                loan.BOOK_ID.toLowerCase().includes(search) ||
                loan.BORROWER_ID.toLowerCase().includes(search) ||
                loan.STAFF_ID.toLowerCase().includes(search)
            );
        }   );

        // Pagination logic
        const totalItems = filteredCurrentLoans.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginatedcurrentLoans = filteredCurrentLoans.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        const handlePageChange = (page: number) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
        };  

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Current Loans Database" />

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
                        <CreateModalForm 
                            title="Add New Current Loan"
                            route="/currentloans"
                            triggerLabel="Add New Loan"
                            fields={[
                                { name: "transaction_id", label: "Transaction ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, fieldType: 'input' as const},
                                { name: "transaction_borrowdate", label: "Date Borrowed", type:"date", placeholder: "", required: true, fieldType: 'input' as const },
                                { name: "transaction_duedate", label: "Due Date", type:"date", placeholder: "", required: true, autoCalculate: {
                                    basedOn: "transaction_borrowdate",
                                    addDays: 7
                                }},
                                { name: "book_id", label: "Book ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, fieldType: 'select' as const, options: bookOptions },
                                { name: "borrower_id", label: "Borrower ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, fieldType: 'select' as const, options: borrowerOptions },
                                { name: "staff_id", label: "Staff ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, fieldType: 'select' as const, options: staffOptions }
                            ]}
                            />
                        </div>
                    </div>
                </div>

                {/*Display header of table*/}
                <div className="p-6 overflow-x-auto">
                    <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm text-left rounded-b-lg">
                        <thead className="bg-foreground">
                            <tr>
                                <th className="px-4 py-2 border-b text-background text-center rounded-tl-lg">Transaction ID</th>
                                <th className="px-4 py-2 border-b text-background text-center">Book</th>
                                <th className="px-4 py-2 border-b text-background text-center">Borrower</th>
                                <th className="px-4 py-2 border-b text-background text-center ">Staff</th>
                                <th className="px-4 py-2 border-b text-background text-center rounded-tr-lg w-28">Actions</th>
                            </tr>
                        </thead>

                    {/*Display data of table using map function in the array, index for future null values*/}
                        <tbody> 
                        {paginatedcurrentLoans && paginatedcurrentLoans.length > 0 ? (
                            paginatedcurrentLoans.map((cLoans, index) => (

                            // I changed AUTHOR_ID to TRANSACTION_ID as the unique key
                            <tr key={cLoans.TRANSACTION_ID || `currentLoans-${index}`} className="hover:bg-muted">
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap text-center">{cLoans.TRANSACTION_ID}</td>
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap text-center">{getBook(cLoans.BOOK_ID)}</td>
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap text-center">{getBorrower(cLoans.BORROWER_ID)}</td>
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap text-center">{getStaff(cLoans.STAFF_ID)}</td>
                                        <td className= "border-b text-foreground text-center">
                                            <div className="flex justify-center space-x-1">
                                            <EditModalForm 
                                            title="Edit Current Loan"
                                            triggerVariant="outline"
                                            route={`/currentloans/${cLoans.TRANSACTION_ID}`}
                                            initialData={{
                                                transaction_id: cLoans.TRANSACTION_ID,
                                                transaction_borrowdate: cLoans.TRANSACTION_BORROWDATE,
                                                transaction_duedate: cLoans.TRANSACTION_DUEDATE,
                                                book_id: cLoans.BOOK_ID,
                                                borrower_id: cLoans.BORROWER_ID,
                                                staff_id: cLoans.STAFF_ID,
                                            }}
                                            fields={[
                                                { name: "transaction_id", label: "Transaction ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, readonly: true, fieldType: 'input' as const },
                                                { name: "transaction_borrowdate", label: "Date Borrowed", type:"date", placeholder: "", required: true, fieldType: 'input' as const },
                                                { name: "transaction_duedate", label: "Due Date", type:"date", placeholder: "", required: true, autoCalculate: {
                                                    basedOn: "transaction_borrowdate",
                                                    addDays: 7
                                                }},
                                                { name: "book_id", label: "Book ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, fieldType: 'select' as const, options: bookOptions },
                                                { name: "borrower_id", label: "Borrower ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, fieldType: 'select' as const, options: borrowerOptions },
                                                { name: "staff_id", label: "Staff ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, fieldType: 'select' as const, options: staffOptions}
                                            ]}
                                            />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-500">
                                        {}
                                        {filters.search ? 'No current loans found for your search.' : 'No current loans found.'}
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

