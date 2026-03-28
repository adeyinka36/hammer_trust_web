import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy & policy | Hammer Trust',
  description:
    'How Hammer Trust collects and uses data for the uploader portal and related mobile services.',
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
