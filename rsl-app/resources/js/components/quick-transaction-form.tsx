import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface QuickTransactionFormProps {
    onSubmit: (data: any) => void;
}

export default function QuickTransactionForm({ onSubmit }: QuickTransactionFormProps) {
    const [formData, setFormData] = useState({
        borrower: '',
        book: '',
        transactionType: 'borrow',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ borrower: '', book: '', transactionType: 'borrow' });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Add Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Select Borrower"
                    value={formData.borrower}
                    onChange={(e) => setFormData({ ...formData, borrower: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Select Book"
                    value={formData.book}
                    onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={formData.transactionType}
                    onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="borrow">Borrow</option>
                    <option value="return">Return</option>
                </select>
                <Button type="submit" className="w-full">
                    Add Transaction
                </Button>
            </form>
        </div>
    );
}
