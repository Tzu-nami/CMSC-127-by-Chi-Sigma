import React from 'react';

interface Transaction {
    TRANSACTION_ID: string;
    TRANSACTION_BORROWDATE: string;
    TRANSACTION_DUEDATE: string;
    BOOK_TITLE: string;
    BORROWER_FIRSTNAME: string;
    BORROWER_LASTNAME: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
    return (
        <div className="bg-card rounded-lg border border-muted overflow-hidden">
            <div className="p-6 border-b border-muted">
                <h3 className="text-lg font-semibold text-[#374151]">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-card border-b border-muted">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Transaction ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Book Title</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Borrower</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Borrow Date</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#374151]">Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions && transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <tr key={index} className="border-b border-muted hover:bg-muted">
                                    <td className="px-4 py-2 text-sm text-[#374151]">{transaction.TRANSACTION_ID}</td>
                                    {/* new book title field */}
                                    <td className="px-4 py-2 text-sm text-[#374151]">{transaction.BOOK_TITLE}</td>
                                    {/* first n last name */}
                                    <td className="px-4 py-2 text-sm text-[#374151]">
                                        {transaction.BORROWER_FIRSTNAME} {transaction.BORROWER_LASTNAME}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-[#374151]">{transaction.TRANSACTION_BORROWDATE}</td>
                                    <td className="px-4 py-2 text-sm text-[#374151]">{transaction.TRANSACTION_DUEDATE}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-[#6b7280]">
                                    No recent transactions
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}