import type { TabProps } from "@/types";

const Tab: React.FC<TabProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded px-2.5 py-2 ${active ? "bg-solidGray/5 font-bold" : "hover:bg-gray-50"}`}
  >
    {children}
  </button>
);
export default Tab;
