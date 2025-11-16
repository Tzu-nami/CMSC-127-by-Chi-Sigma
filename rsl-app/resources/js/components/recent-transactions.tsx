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
    const headers = ["Transaction ID", "Book Title", "Borrower", "Borrow Date", "Due Date"];
    
    return (
        <div className="bg-card rounded-lg overflow-hidden">
            <div className="p-3">
                <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left rounded-t-lg">
                    <thead className="bg-foreground rounded-t-lg">
                        <tr>
                            {headers.map((header, index) => (
                                <th 
                                    key={header} 
                                    className={`
                                        px-4 py-2 text-background
                                        ${index === 0 ? 'rounded-tl-lg' : ''}
                                        ${index === headers.length - 1 ? 'rounded-tr-lg' : ''}
                                    `}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {transactions && transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <tr key={index} className="border-b border-muted hover:bg-muted">
                                    <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{transaction.TRANSACTION_ID}</td>
                                    <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{transaction.BOOK_TITLE}</td>
                                    <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">
                                        {transaction.BORROWER_FIRSTNAME} {transaction.BORROWER_LASTNAME}
                                    </td>
                                    <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{transaction.TRANSACTION_BORROWDATE}</td>
                                    <td className="px-4 py-2 border-b text-foreground whitespace-nowrap">{transaction.TRANSACTION_DUEDATE}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
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