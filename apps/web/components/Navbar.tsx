'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full p-4 bg-[var(--primary)] text-[var(--background)]">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          TypeMasterPro
        </Link>
        <Link
          href="/room"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-opacity-90 bg-[var(--background)] text-[var(--primary)]"
        >
          <Users className="h-5 w-5" />
          <span>Collaborate</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
