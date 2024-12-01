import React from 'react';
import { 
    FaChevronLeft, 
    FaChevronRight, 
    FaHeartbeat, 
    FaBolt, 
    FaChartBar, 
    FaDumbbell, 
    FaPuzzlePiece, 
    FaClipboardList, 
    FaCalculator
} from 'react-icons/fa';
import Link from 'next/link';
import Logo from './Logo';
import { useSidebar } from '@/src/contexts/SidebarContext';
import { useAuthenticator } from "@aws-amplify/ui-react";

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const navGroups: NavGroup[] = [
    {
        title: 'Dashboard',
        items: [
            { icon: <FaHeartbeat />, label: 'Biometrics', href: '/dashboard/biometrics' },
            { icon: <FaBolt />, label: 'Performance', href: '/dashboard/performance' },
            { icon: <FaChartBar />, label: 'Output Tracking', href: '/dashboard/tracking' },
        ]
    },
    {
        title: 'Management',
        items: [
            { icon: <FaDumbbell />, label: 'Workouts', href: '/management/workouts' },
            { icon: <FaPuzzlePiece />, label: 'Components', href: '/management/workout-components' },
            { icon: <FaClipboardList />, label: 'Exercises', href: '/management/exercises' },
        ]
    },
    {
        title: 'Tools',
        items: [
            { icon: <FaCalculator />, label: 'Output Calculator', href: '/tools/calculator' },
        ]
    }
];

export default function PersistentSidebar() {
    const { isExpanded, setIsExpanded } = useSidebar();
    const { user } = useAuthenticator((context) => [context.user]);

    if (!user) {
        return null;
    }

    return (
        <div className={`persistent-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button
                className="toggle-button"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
                {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
            <div className="nav-logo">
                <Link href="/">
                    <Logo width={50} height={50} />
                </Link>
            </div>
            <nav className="persistent-nav">
                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="nav-group">
                        <h3 className={`nav-group-title ${isExpanded ? 'expanded' : ''}`}>
                            {group.title}
                        </h3>
                        <ul>
                            {group.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    <Link href={item.href}>
                                        <span className="icon">{item.icon}</span>
                                        {isExpanded && <span className="label">{item.label}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </div>
    );
} 