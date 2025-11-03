import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff',
        href: '/staffdatabase',
    },
];

export default function StaffIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff" />
            <div>
                Hello Staff
            </div>
        </AppLayout>
    );
}
