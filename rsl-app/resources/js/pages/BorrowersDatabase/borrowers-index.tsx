import React,{ use, useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Borrowers Database',
        href: '/borrowersdatabase',
    },
];
import {
    Search as SearchIcon,
    Plus as PlusIcon,
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
export default function BorrowersIndex( {borrowers, filters}: { borrowers: any[], filters:{search?: string}} ) {

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
                    '/borrowersdatabase',
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
        const filteredBorrowers = borrowers.filter((borrower) => {
            const search = searchTerm.toLowerCase();
            return (
                borrower.BORROWER_ID.toLowerCase().includes(search) ||
                borrower.BORROWER_LASTNAME.toLowerCase().includes(search) ||
                borrower.BORROWER_FIRSTNAME.toLowerCase().includes(search) ||
                borrower.BORROWER_CONTACTNUMBER.toLowerCase().includes(search)
            );
        }   );

        // Pagination logic
        const totalItems = filteredBorrowers.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginatedBorrowers = filteredBorrowers.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        const handlePageChange = (page: number) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
        };  

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrowers Database" />

            <div className="bg-[#ffffff] shadow-sm rounded-lg overflow-hidden">
                
                <div className="p-4 sm:p-6 border-b border-[#e5e7eb]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        
                        <div className="relative w-full md:max-w-md">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                            <Input
                                placeholder="Search by name, ID, contact number..."
                                className="pl-9"
                                value ={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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
                    </div>
                </div>

                {/*Display header of table*/}
                <div className="p-6 overflow-x-auto">
                    <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm text-left rounded-b-lg">
                        <thead className="bg-foreground">
                            <tr>
                                <th className="px-4 py-2 border-b text-background rounded-tl-lg">Borrower ID</th>
                                <th className="px-4 py-2 border-b text-background">Last Name</th>
                                <th className="px-4 py-2 border-b text-background">First Name</th>
                                <th className="px-4 py-2 border-b text-background">Middle Initial</th>
                                <th className="px-4 py-2 border-b text-background">Status</th>
                                <th className="px-4 py-2 border-b text-background rounded-tr-lg">Contact Number</th>
                                <th className="px-4 py-2 border-b text-background rounded-tr-lg text-center" colSpan={2}>Actions</th>
                            </tr>
                        </thead>

                    {/*Display data of table using map function in the array, index for future null values*/}
                        <tbody> 
                        {paginatedBorrowers && paginatedBorrowers.length > 0 ? (
                            paginatedBorrowers.map((borrower, index) => (
                            <tr key={borrower.BORROWER_ID || `borrower-${index}`} className="hover:bg-muted">
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{borrower.BORROWER_ID}</td>
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{borrower.BORROWER_LASTNAME}</td>
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{borrower.BORROWER_FIRSTNAME}</td>
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{borrower.BORROWER_MIDDLEINITIAL}</td>
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{borrower.BORROWER_STATUS}</td>
                                        <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{borrower.BORROWER_CONTACTNUMBER}</td>
                                        <td>
                                            <EditModalForm 
                                            title="Edit Borrower"
                                            triggerVariant="outline"
                                            route={`/borrowersdatabase/${borrower.BORROWER_ID}`}
                                            initialData={{
                                                borrower_id: borrower.BORROWER_ID,
                                                borrower_lastname: borrower.BORROWER_LASTNAME,
                                                borrower_firstname: borrower.BORROWER_FIRSTNAME,
                                                borrower_middleinitial: borrower.BORROWER_MIDDLEINITIAL,
                                                borrower_status: borrower.BORROWER_STATUS,
                                                borrower_contactnumber: borrower.BORROWER_CONTACTNUMBER,
                                            }}
                                            fields={[
                                                { name: "borrower_id", label: "Borrower ID", type:"text", placeholder: "e.g. A1Z26", required: true, maxLength: 5, readonly: true },
                                                { name: "borrower_lastname", label: "Last Name", type:"text", placeholder: "Enter Last Name", required: true, maxLength: 255, pattern: "[^0-9]*" },
                                                { name: "borrower_firstname", label: "First Name", type:"text", placeholder: "Enter First Name", required: true, maxLength: 255, pattern: "[^0-9]*" },
                                                { name: "borrower_middleinitial", label: "Middle Initial", type:"text", placeholder: "Enter Middle Initial", required: false, maxLength: 2, pattern: "[^0-9]*" },
                                                { name: "borrower_status", label: "Choose a status", type:"text", placeholder: "Enter a status", required: true, maxLength: 100 },
                                                { name: "borrower_contactnumber", label: "Contact Number", type:"text", placeholder: "Enter Contact Number", required: true, maxLength: 15, pattern: "[0-9+-]*"},
                                            ]} />
                                        </td>
                                        <td>
                                            <DeleteForm
                                            route={`/borrowersdatabase/${borrower.BORROWER_ID}`}
                                            item={`Borrower: ${borrower.BORROWER_FIRSTNAME} ${borrower.BORROWER_LASTNAME}`}
                                            triggerVariant="outline"
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                <td colSpan={5} className="py-4 text-center text-gray-500">
                                    {}
                                    {filters.search ? 'No borrowers found for your search.' : 'No borrowers found.'}
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

