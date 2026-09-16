import { Link } from 'react-router-dom';

export default function BackLink({ to, children = 'Volver' }) {
  return (
    <Link to={to} className="back-link">
      ← {children}
    </Link>
  );
}