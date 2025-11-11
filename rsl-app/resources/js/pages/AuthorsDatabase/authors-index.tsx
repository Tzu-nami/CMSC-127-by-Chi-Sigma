import React,{ useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Authors Database',
        href: '/authorsdatabase',
    },
];
import {
    Search as SearchIcon,
    Plus as PlusIcon,
} from 'lucide-react';

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


// --- MAIN PAGE COMPONENT ---
export default function AuthorsIndex( {authors, filters}: { authors: any[], filters:{search?: string}} ) {

    const [searchTerm, setSearchTerm] = useState(filters.search || '');

        useEffect(() =>{
                const timerId = setTimeout(() => {
                    if (searchTerm === (filters.search || '')) {
                        return;
                    }
        
                    router.get(
                        '/authorsdatabase',
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Authors Database" />

            <div className="bg-[#ffffff] shadow-sm rounded-lg overflow-hidden">
                
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
                            <Button className="w-full sm:w-auto">
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add New Author
                            </Button>
                        </div>
                    </div>
                </div>

                {/*Display header of table*/}
                <div className="p-6 overflow-x-auto">
                    <table className="min-w-full border border-gray-200 divide-y divide-gray-200 text-sm text-left rounded-b-lg">
                        <thead className="bg-foreground">
                            <tr>
                                <th className="px-4 py-2 border-b text-background rounded-tl-lg">Author ID</th>
                                <th className="px-4 py-2 border-b text-background">Last Name</th>
                                <th className="px-4 py-2 border-b text-background">First Name</th>
                                <th className="px-4 py-2 border-b text-background rounded-tr-lg">Middle Initial</th>
                            </tr>
                        </thead>

                    {/*Display data of table using map function in the array, index for future null values*/}
                        <tbody> 
                        {authors && authors.length > 0 ? (
                            authors.map((author, index) => (
                            <tr key={author.AUTHOR_ID || `author-${index}`} className="hover:bg-muted">
                                        <td className="px-4 py-2 border-b text-foreground">{author.AUTHOR_ID}</td>
                                        <td className="px-4 py-2 border-b text-foreground">{author.AUTHOR_LASTNAME}</td>
                                        <td className="px-4 py-2 border-b text-foreground">{author.AUTHOR_FIRSTNAME}</td>
                                        <td className="px-4 py-2 border-b text-foreground">{author.AUTHOR_MIDDLEINITIAL}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-500">
                                        {}
                                        {filters.search ? 'No authors found for your search.' : 'No authors found.'}
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

