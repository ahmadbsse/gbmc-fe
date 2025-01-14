import type { TabProps } from "@/types";

const Tab: React.FC<TabProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-lg px-4 py-2 ${
      active ? "bg-solidGray/5 font-medium text-primary" : "hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);
export default Tab;
