interface InventoryCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}

export default function InventoryCard({ title, value, icon, color }: InventoryCardProps) {
    return (
        <div className="bg-card rounded-lg border border-muted p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[#6b7280] text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}