declare module 'dreamland-router' {
    export class Router {
        constructor(root: any);
        navigate(path: string): boolean;
        route(path: string): boolean;
        mount(root: HTMLElement): void;
    }

    export const Route: any;
    export const Redirect: any;
    export const Link: any;
}

declare module '@dreamlandjs/dreamland-router' {
    export * from 'dreamland-router';
}
