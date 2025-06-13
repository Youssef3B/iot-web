import {
  Shield,
  Users,
  Activity,
  Eye,
  UserPlus,
  BarChart3,
  Menu,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";
const QuickActionButton = ({ title, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 flex items-center justify-between transition-colors duration-200 group"
  >
    <div className="flex items-center">
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{title}</span>
    </div>
    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
  </button>
);

export default QuickActionButton;
