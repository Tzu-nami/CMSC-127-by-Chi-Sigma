import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Borrowers Database',
        href: '/borrowersdatabase',
    },
];

export default function BorrowersIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrowers Database" />
            <div>
                Hello Borrowers Database
            </div>
        </AppLayout>
    );
}
