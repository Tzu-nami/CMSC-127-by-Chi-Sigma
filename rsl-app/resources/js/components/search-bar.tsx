import { SearchIcon } from 'lucide-react';
import React from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
        setSearchTerm('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
                <input
                    type="text"
                    placeholder="Search books, borrowers, transactions..."
                    className="w-full pl-9 pr-4 py-2 border border-muted rounded-md focus:outline-none focus:ring-1 focus:ring-[#8C9657]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-[#8C9657] text-white rounded-md hover:bg-[#444034] transition-colors"
            >
                Search
            </button>
        </form>
    );
}
