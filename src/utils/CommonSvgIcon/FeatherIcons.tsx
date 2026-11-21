// Import only the icons the app uses. "import * as Icon from 'react-feather'"
// put all ~290 feather icons (about 340 KB) into the file every page loads.
// To use another icon, import it here and add it to the map.
import {
  ChevronDown,
  ChevronUp,
  FileText,
  LogOut,
  Mail,
  Settings,
  User,
  X,
} from "react-feather";

const Icon = { ChevronDown, ChevronUp, FileText, LogOut, Mail, Settings, User, X };

export interface FeatherIconType {
  iconName: keyof typeof Icon;
  className?: string;
  onClick?: () => void;
}

const FeatherIcons: React.FC<FeatherIconType> = ({ iconName, className, onClick }) => {
  const IconComp = Icon[iconName];
  return <IconComp className={className} onClick={onClick} />;
};

export default FeatherIcons;
