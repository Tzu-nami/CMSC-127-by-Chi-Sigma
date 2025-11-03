import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Current Loans',
        href: '/currentloans',
    },
];

export default function CurrentLoansIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Current Loans" />
            <div>
                Hello Current Loans
            </div>
        </AppLayout>
    );
}
