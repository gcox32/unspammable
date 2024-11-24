import React from 'react';
import { FaChevronLeft, FaChevronRight, FaHome, FaCog, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import Logo from './Logo';
import { useSidebar } from '../contexts/SidebarContext';

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { icon: <FaCog />, label: 'Settings', href: '/about' },
    { icon: <FaUser />, label: 'Profile', href: '/contact' },
];

export default function PersistentSidebar() {
    const { isExpanded, setIsExpanded } = useSidebar();

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
                <ul>
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href}>
                                <span className="icon">{item.icon}</span>
                                {isExpanded && <span className="label">{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
} 