"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookDetailsModalProps {
    book: any; 
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DetailRow = ({ label, value, highlight }: { label: string, value: string | number, highlight?: 'green' | 'red' }) => (
    <div className="flex flex-row justify-between items-start">
        <span className="text-sm font-medium text-[#8C9657] whitespace-nowrap mr-4">{label}</span>
        
        <span className={`text-sm font-medium text-right ${ 
            highlight === 'green' ? 'text-[#444034]' : 
            highlight === 'red' ? 'text-red-600' : 
            'text-foreground' 
        }`}>
            {value}
        </span>
    </div>
);

export default function BookDetailsModal({ book, open, onOpenChange }: BookDetailsModalProps) {
    if (!book) return null; 

    const total = book.BOOK_COPIES || 0;
    const loaned = book.current_loans_count || 0;
    const available = total - loaned;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader className="mt-4"> 
                    <DialogTitle className="text-lg font-semibold leading-snug text-foreground break-all">
                        {book.BOOK_TITLE}
                    </DialogTitle>
                </DialogHeader>

                <div className="h-px bg-border -mx-6" />

                <div className="grid gap-4 pt-4">
                    <div className="space-y-3">
                        <DetailRow label="Author(s)" value={book.author_names} />
                        <DetailRow label="Year Published" value={book.BOOK_YEAR} />
                        <DetailRow label="Publisher" value={book.BOOK_PUBLISHER} />
                        <DetailRow label="Genre(s)" value={book.genre_names} />
                        <DetailRow 
                            label="Availability" 
                            value={`${available} / ${total}`} 
                            highlight={available > 0 ? 'green' : 'red'} 
                        />
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}