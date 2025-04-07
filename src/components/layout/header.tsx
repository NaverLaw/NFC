import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="border-b border-white/10 backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-gradient">
          NFC Profiles
        </Link>
        <Button variant="outline" asChild>
          <Link to="/signup" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </Link>
        </Button>
      </div>
    </header>
  );
}