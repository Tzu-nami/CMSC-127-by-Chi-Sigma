import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    return (
        <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#374151]">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-[#6b7280] py-2">
                        {day}
                    </div>
                ))}
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`aspect-square flex items-center justify-center rounded text-sm font-medium
                            ${day === today.getDate() && currentDate.getMonth() === today.getMonth() ? 'bg-[#8C9657] text-white' : 'text-[#374151]'}
                            ${day === null ? 'text-[#d1d5db]' : 'hover:bg-[#f3f4f6]'}
                        `}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}
