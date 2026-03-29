import { CheckSquare } from "lucide-react";

interface WelcomeHeaderProps {
  firstName: string;
  term: string;
  todoCount: number;
}

export default function WelcomeHeader({ firstName, term, todoCount }: WelcomeHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0D2B5E] flex items-center gap-2">
          Welcome back, {firstName}! <span className="text-2xl">👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Here is your academic overview for {term}.
        </p>
      </div>
      <button className="flex items-center gap-2 bg-white text-[#0D2B5E] border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
        <CheckSquare size={16} />
        To-Do List
        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{todoCount}</span>
      </button>
    </div>
  );
}