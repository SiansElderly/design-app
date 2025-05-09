import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

export default function SmartBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) return null;

  const getDisplayName = (path: string) => {
    const map: Record<string, string> = {
      'services': 'Каталог услуг',
      'requests': 'Мои заявки',
      [pathnames[0]]: pathnames[0] === 'services' ? 'Каталог' : pathnames[0]
    };
    return map[path] || path;
  };

  return (
    <div className="mb-3 ps-2 border-start border-3 border-primary">
      <Breadcrumb listProps={{ className: "mb-0 py-1" }}>
        <Breadcrumb.Item 
          linkAs={Link} 
          linkProps={{ to: "/", className: "text-decoration-none" }}
        >
          Главная
        </Breadcrumb.Item>
        
        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Breadcrumb.Item active key={name} className="text-muted">
              {getDisplayName(name)}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item
              linkAs={Link}
              linkProps={{ 
                to: `/${pathnames.slice(0, index + 1).join('/')}`,
                className: "text-decoration-none"
              }}
              key={name}
            >
              {getDisplayName(name)}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </div>
  );
}