import { Link } from 'react-router';
import Logo from '../../assets/Logo.jsx';
import Button from '../ui/Button.jsx';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-dark-100 py-4">
      <div className="container-lg flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex gap-3">
          <Button as={Link} to="/login" variant="ghost">Login</Button>
          <Button as={Link} to="/register" variant="primary">Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
