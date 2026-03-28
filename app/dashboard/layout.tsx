import type { Metadata } from 'next';
import { UploaderDashboardGate } from '@/components/dashboard/UploaderDashboardGate';

export const metadata: Metadata = {
  title: 'Dashboard | Hammer Trust',
  description: 'Hammer Trust uploader portal',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UploaderDashboardGate>{children}</UploaderDashboardGate>;
}
