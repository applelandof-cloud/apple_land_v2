const routeTranslations: { [key: string]: string } = {
    '/dashboard': 'Tablero',
    '/products': 'Productos',
    '/settings': 'Configuración',
    '/places': 'Lugares',
    '/sales': 'Ventas',
    '/reports': 'Reportes',
    '/staff': 'Usuarios',
    '/customers': 'Clientes',
    '/inventory': 'Inventario',
    // Add more route translations here
};

export function getTranslatedRouteTitle(path: string): string {
    // Remove query parameters and hash from the path
    const cleanPath = path.split('?')[0].split('#')[0];

    // Try to find an exact match
    if (routeTranslations[cleanPath]) {
        return routeTranslations[cleanPath];
    }

    // Fallback: try to translate the last segment of the path
    const segments = cleanPath.split('/').filter(Boolean);
    if (segments.length > 0) {
        const lastSegment = '/' + segments[segments.length - 1];
        if (routeTranslations[lastSegment]) {
            return routeTranslations[lastSegment];
        }
    }

    // If no translation is found, format the path into a title
    return segments.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join(' ');
}
