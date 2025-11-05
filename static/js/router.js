class Router {
    constructor() {
        this.routes = {};
        this.currentPath = null;
        window.addEventListener('hashchange', this.hashChange.bind(this));
        window.addEventListener('load', this.hashChange.bind(this));
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    hashChange() {
        this.currentPath = window.location.hash.slice(1) || '/';
        this.matchRoute();
    }

    matchRoute() {
        // Try exact match first
        if (this.routes[this.currentPath]) {
            this.routes[this.currentPath]();
            return;
        }

        // Try dynamic routes (e.g., /restaurants/:id)
        for (const path in this.routes) {
            if (path.includes(':')) {
                const regexPath = path.replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)');
                const match = this.currentPath.match(new RegExp(`^${regexPath}$`));
                if (match) {
                    const paramNames = (path.match(/:([a-zA-Z0-9_]+)/g) || []).map(p => p.slice(1));
                    const params = {};
                    paramNames.forEach((name, index) => {
                        params[name] = match[index + 1];
                    });
                    this.routes[path](params);
                    return;
                }
            }
        }

        // If no route matches, go to home or show 404
        if (this.routes['/404']) {
            this.routes['/404']();
        } else {
            this.navigate('/');
            // console.warn("No route found for:", this.currentPath);
        }
    }

    navigate(path) {
        window.location.hash = path;
    }
}

export const router = new Router();