'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, X } from 'lucide-react';

interface UploaderSidebarProps {
  readonly onClose?: () => void;
  readonly showCloseButton?: boolean;
}

export default function UploaderSidebar({
  onClose,
  showCloseButton = false,
}: UploaderSidebarProps) {
  const pathname = usePathname();

  const items = [
    { id: 'dash', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ] as const;

  const active = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === href || pathname.startsWith(`${href}/`);

  const onNav = () => onClose?.();

  return (
    <aside className="w-64 h-full flex flex-col bg-white border-r border-border-soft shadow-sm">
      <div className="p-5 border-b border-border-soft flex items-start justify-between gap-2">
        <Link
          href="/dashboard"
          onClick={onNav}
          className="relative block w-full h-[10.5rem] shrink-0"
        >
          <Image
            src="/app-logo.png"
            alt="Hammer Trust"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>
        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-brand hover:bg-surface-tint transition-colors duration-200"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        ) : null}
      </div>
      <p className="px-5 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        Uploader portal
      </p>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isOn = active(item.href);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={onNav}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isOn
                      ? 'bg-brand text-white shadow-md'
                      : 'text-slate-600 hover:text-brand hover:bg-surface-tint'
                  }`}
                >
                  <Icon size={20} strokeWidth={isOn ? 2.25 : 2} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
