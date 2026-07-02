"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { label: string; value: string; icon?: React.ReactNode }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function Tabs({ tabs, value, onChange, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(value || tabs[0]?.value);
  const tabRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (tabRef.current) {
      const activeButton = tabRef.current.querySelector(
        `[data-tab="${activeTab}"]`
      ) as HTMLElement;
      if (activeButton) {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        });
      }
    }
  }, [activeTab]);

  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue);
    onChange?.(tabValue);
  };

  return (
    <div className={cn("w-full", className)}>
      <div ref={tabRef} className="relative flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            data-tab={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200",
              activeTab === tab.value
                ? "text-primary"
                : "text-foreground-secondary hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <div
          className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />
      </div>
      <div className="pt-6">
        {children}
      </div>
    </div>
  );
}

interface TabPanelProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
}

export function TabPanel({ value, activeTab, children }: TabPanelProps) {
  if (value !== activeTab) return null;
  return <div>{children}</div>;
}
