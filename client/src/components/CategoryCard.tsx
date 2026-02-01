import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  href: string;
  color?: string;
}

export function CategoryCard({ icon: Icon, label, href, color = "bg-blue-50 text-blue-600" }: CategoryCardProps) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-32 group">
        <div className={`p-3 rounded-full mb-3 ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="font-semibold text-sm text-gray-700 text-center group-hover:text-primary transition-colors">
          {label}
        </span>
      </div>
    </Link>
  );
}
