import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books Database',
        href: '/booksdatabase',
    },
];

export default function BooksIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Books Database" />
            <div>
                Hello Books Database
            </div>
        </AppLayout>
    );
}
