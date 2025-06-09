import type { FileItem } from "@/types/interfaces"

const createNextjsStructure = (): FileItem => ({
    id: "root",
    name: "nextjs-project",
    type: "folder",
    children: [
        {
            id: "app-1",
            name: "app",
            type: "folder",
            children: [
                { id: "page-1", name: "page.tsx", type: "file" },
                { id: "layout-1", name: "layout.tsx", type: "file" },
                { id: "globals-1", name: "globals.css", type: "file" },
                {
                    id: "api-1",
                    name: "api",
                    type: "folder",
                    children: [
                        {
                            id: "hello-1",
                            name: "hello",
                            type: "folder",
                            children: [{ id: "route-1", name: "route.ts", type: "file" }],
                        },
                    ],
                },
            ],
        },
        {
            id: "components-1",
            name: "components",
            type: "folder",
            children: [
                {
                    id: "ui-1",
                    name: "ui",
                    type: "folder",
                    children: [],
                },
            ],
        },
        {
            id: "lib-1",
            name: "lib",
            type: "folder",
            children: [{ id: "utils-1", name: "utils.ts", type: "file" }],
        },
        {
            id: "public-1",
            name: "public",
            type: "folder",
            children: [],
        },
        { id: "package-1", name: "package.json", type: "file" },
        { id: "next-config-1", name: "next.config.js", type: "file" },
        { id: "tailwind-config-1", name: "tailwind.config.ts", type: "file" },
        { id: "tsconfig-1", name: "tsconfig.json", type: "file" },
    ],
})

const createReactStructure = (): FileItem => ({
    id: "root",
    name: "react-project",
    type: "folder",
    children: [
        {
            id: "src-1",
            name: "src",
            type: "folder",
            children: [
                { id: "app-1", name: "App.tsx", type: "file" },
                { id: "main-1", name: "main.tsx", type: "file" },
                { id: "index-css-1", name: "index.css", type: "file" },
                {
                    id: "components-1",
                    name: "components",
                    type: "folder",
                    children: [],
                },
                {
                    id: "hooks-1",
                    name: "hooks",
                    type: "folder",
                    children: [],
                },
                {
                    id: "utils-1",
                    name: "utils",
                    type: "folder",
                    children: [],
                },
            ],
        },
        {
            id: "public-1",
            name: "public",
            type: "folder",
            children: [
                { id: "vite-svg-1", name: "vite.svg", type: "file" },
                { id: "index-html-1", name: "index.html", type: "file" },
            ],
        },
        { id: "package-1", name: "package.json", type: "file" },
        { id: "vite-config-1", name: "vite.config.ts", type: "file" },
        { id: "tsconfig-1", name: "tsconfig.json", type: "file" },
    ],
})

const createVueStructure = (): FileItem => ({
    id: "root",
    name: "vue-project",
    type: "folder",
    children: [
        {
            id: "src-1",
            name: "src",
            type: "folder",
            children: [
                { id: "app-1", name: "App.vue", type: "file" },
                { id: "main-1", name: "main.ts", type: "file" },
                {
                    id: "components-1",
                    name: "components",
                    type: "folder",
                    children: [],
                },
                {
                    id: "views-1",
                    name: "views",
                    type: "folder",
                    children: [],
                },
                {
                    id: "composables-1",
                    name: "composables",
                    type: "folder",
                    children: [],
                },
            ],
        },
        {
            id: "public-1",
            name: "public",
            type: "folder",
            children: [],
        },
        { id: "package-1", name: "package.json", type: "file" },
        { id: "vite-config-1", name: "vite.config.ts", type: "file" },
        { id: "tsconfig-1", name: "tsconfig.json", type: "file" },
    ],
})

const createAngularStructure = (): FileItem => ({
    id: "root",
    name: "angular-project",
    type: "folder",
    children: [
        {
            id: "src-1",
            name: "src",
            type: "folder",
            children: [
                { id: "main-1", name: "main.ts", type: "file" },
                { id: "index-1", name: "index.html", type: "file" },
                {
                    id: "app-1",
                    name: "app",
                    type: "folder",
                    children: [
                        { id: "app-component-1", name: "app.component.ts", type: "file" },
                        { id: "app-component-html-1", name: "app.component.html", type: "file" },
                        { id: "app-module-1", name: "app.module.ts", type: "file" },
                    ],
                },
            ],
        },
        { id: "package-1", name: "package.json", type: "file" },
        { id: "tsconfig-1", name: "tsconfig.json", type: "file" },
        { id: "angular-json-1", name: "angular.json", type: "file" },
    ],
})

const createSvelteStructure = (): FileItem => ({
    id: "root",
    name: "svelte-project",
    type: "folder",
    children: [
        {
            id: "src-1",
            name: "src",
            type: "folder",
            children: [
                { id: "app-1", name: "App.svelte", type: "file" },
                { id: "main-1", name: "main.ts", type: "file" },
                {
                    id: "lib-1",
                    name: "lib",
                    type: "folder",
                    children: [],
                },
                {
                    id: "routes-1",
                    name: "routes",
                    type: "folder",
                    children: [],
                },
            ],
        },
        { id: "package-1", name: "package.json", type: "file" },
        { id: "tsconfig-1", name: "tsconfig.json", type: "file" },
        { id: "svelte-config-1", name: "svelte.config.js", type: "file" },
        { id: "vite-config-1", name: "vite.config.js", type: "file" },
    ],
})

const createNuxtStructure = (): FileItem => ({
    id: "root",
    name: "nuxt-project",
    type: "folder",
    children: [
        {
            id: "pages-1",
            name: "pages",
            type: "folder",
            children: [{ id: "index-1", name: "index.vue", type: "file" }],
        },
        {
            id: "components-1",
            name: "components",
            type: "folder",
            children: [],
        },
        {
            id: "layouts-1",
            name: "layouts",
            type: "folder",
            children: [{ id: "default-1", name: "default.vue", type: "file" }],
        },
        {
            id: "public-1",
            name: "public",
            type: "folder",
            children: [],
        },
        { id: "package-1", name: "package.json", type: "file" },
        { id: "tsconfig-1", name: "tsconfig.json", type: "file" },
        { id: "nuxt-config-1", name: "nuxt.config.ts", type: "file" },
    ],
})

const createRemixStructure = (): FileItem => ({
    id: "root",
    name: "remix-project",
    type: "folder",
    children: [
        {
            id: "app-1",
            name: "app",
            type: "folder",
            children: [
                { id: "root-1", name: "root.tsx", type: "file" },
                { id: "entry-client-1", name: "entry.client.tsx", type: "file" },
                { id: "entry-server-1", name: "entry.server.tsx", type: "file" },
                {
                    id: "routes-1",
                    name: "routes",
                    type: "folder",
                    children: [{ id: "index-1", name: "_index.tsx", type: "file" }],
                },
            ],
        },
        {
            id: "public-1",
            name: "public",
            type: "folder",
            children: [],
        },
        { id: "package-1", name: "package.json", type: "file" },
        { id: "tsconfig-1", name: "tsconfig.json", type: "file" },
        { id: "remix-config-1", name: "remix.config.js", type: "file" },
    ],
})

const createAstroStructure = (): FileItem => ({
    id: "root",
    name: "astro-project",
    type: "folder",
    children: [
        {
            id: "src-1",
            name: "src",
            type: "folder",
            children: [
                {
                    id: "pages-1",
                    name: "pages",
                    type: "folder",
                    children: [{ id: "index-1", name: "index.astro", type: "file" }],
                },
                {
                    id: "components-1",
                    name: "components",
                    type: "folder",
                    children: [],
                },
                {
                    id: "layouts-1",
                    name: "layouts",
                    type: "folder",
                    children: [{ id: "layout-1", name: "Layout.astro", type: "file" }],
                },
            ],
        },
        {
            id: "public-1",
            name: "public",
            type: "folder",
            children: [],
        },
        { id: "package-1", name: "package.json", type: "file" },
        { id: "tsconfig-1", name: "tsconfig.json", type: "file" },
        { id: "astro-config-1", name: "astro.config.mjs", type: "file" },
    ],
})

// Framework structure generators mapping
const FRAMEWORK_GENERATORS: Record<string, () => FileItem> = {
    "Next.js": createNextjsStructure,
    React: createReactStructure,
    "Vue.js": createVueStructure,
    Angular: createAngularStructure,
    Svelte: createSvelteStructure,
    "Nuxt.js": createNuxtStructure,
    Remix: createRemixStructure,
    Astro: createAstroStructure,
}

export const getFrameworkStructure = (framework: string): FileItem => {
    const generator = FRAMEWORK_GENERATORS[framework]
    if (!generator) {
        console.error(`Framework "${framework}" not found in generators`)
        throw new Error(`Unsupported framework: ${framework}`)
    }

    const structure = generator()
    return structure
}

// Export available frameworks for consistency
export const getAvailableFrameworks = (): string[] => {
    return Object.keys(FRAMEWORK_GENERATORS)
}
