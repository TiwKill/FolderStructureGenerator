import { FileFolderItem } from '@/types/interfaces'

const createNextjsStructure = (): FileFolderItem => ({
    id: 'root',
    name: 'Next.js',
    type: 'folder',
    children: [
        {
            id: 'app-1',
            name: 'app',
            type: 'folder',
            children: [
                { id: 'page-1', name: 'page.tsx', type: 'file' },
                { id: 'layout-1', name: 'layout.tsx', type: 'file' },
                {
                    id: 'components-1',
                    name: 'components',
                    type: 'folder',
                    children: []
                }
            ]
        },
        {
            id: 'public-1',
            name: 'public',
            type: 'folder',
            children: []
        },
        { id: 'package-1', name: 'package.json', type: 'file' },
        { id: 'tsconfig-1', name: 'tsconfig.json', type: 'file' },
        { id: 'next-config-1', name: 'next.config.js', type: 'file' }
    ]
})

const createReactStructure = (): FileFolderItem => ({
    id: 'root',
    name: 'React',
    type: 'folder',
    children: [
        {
            id: 'src-1',
            name: 'src',
            type: 'folder',
            children: [
                { id: 'app-1', name: 'App.tsx', type: 'file' },
                { id: 'index-1', name: 'index.tsx', type: 'file' },
                {
                    id: 'components-1',
                    name: 'components',
                    type: 'folder',
                    children: []
                }
            ]
        },
        {
            id: 'public-1',
            name: 'public',
            type: 'folder',
            children: [
                { id: 'index-2', name: 'index.html', type: 'file' }
            ]
        },
        { id: 'package-1', name: 'package.json', type: 'file' },
        { id: 'tsconfig-1', name: 'tsconfig.json', type: 'file' }
    ]
})

const createVueStructure = (): FileFolderItem => ({
    id: 'root',
    name: 'Vue',
    type: 'folder',
    children: [
        {
            id: 'src-1',
            name: 'src',
            type: 'folder',
            children: [
                { id: 'app-1', name: 'App.vue', type: 'file' },
                { id: 'main-1', name: 'main.ts', type: 'file' },
                {
                    id: 'components-1',
                    name: 'components',
                    type: 'folder',
                    children: []
                }
            ]
        },
        {
            id: 'public-1',
            name: 'public',
            type: 'folder',
            children: [
                { id: 'index-1', name: 'index.html', type: 'file' }
            ]
        },
        { id: 'package-1', name: 'package.json', type: 'file' },
        { id: 'tsconfig-1', name: 'tsconfig.json', type: 'file' },
        { id: 'vite-config-1', name: 'vite.config.ts', type: 'file' }
    ]
})

const createAngularStructure = (): FileFolderItem => ({
    id: 'root',
    name: 'Angular',
    type: 'folder',
    children: [
        {
            id: 'src-1',
            name: 'src',
            type: 'folder',
            children: [
                { id: 'main-1', name: 'main.ts', type: 'file' },
                {
                    id: 'app-1',
                    name: 'app',
                    type: 'folder',
                    children: [
                        { id: 'app-component-1', name: 'app.component.ts', type: 'file' },
                        { id: 'app-module-1', name: 'app.module.ts', type: 'file' }
                    ]
                }
            ]
        },
        { id: 'package-1', name: 'package.json', type: 'file' },
        { id: 'tsconfig-1', name: 'tsconfig.json', type: 'file' },
        { id: 'angular-json-1', name: 'angular.json', type: 'file' }
    ]
})

const createSvelteStructure = (): FileFolderItem => ({
    id: 'root',
    name: 'Svelte',
    type: 'folder',
    children: [
        {
            id: 'src-1',
            name: 'src',
            type: 'folder',
            children: [
                { id: 'app-1', name: 'App.svelte', type: 'file' },
                {
                    id: 'lib-1',
                    name: 'lib',
                    type: 'folder',
                    children: []
                },
                {
                    id: 'routes-1',
                    name: 'routes',
                    type: 'folder',
                    children: []
                }
            ]
        },
        { id: 'package-1', name: 'package.json', type: 'file' },
        { id: 'tsconfig-1', name: 'tsconfig.json', type: 'file' },
        { id: 'svelte-config-1', name: 'svelte.config.js', type: 'file' }
    ]
})

const createNuxtStructure = (): FileFolderItem => ({
    id: 'root',
    name: 'Nuxt',
    type: 'folder',
    children: [
        {
            id: 'pages-1',
            name: 'pages',
            type: 'folder',
            children: [
                { id: 'index-1', name: 'index.vue', type: 'file' }
            ]
        },
        {
            id: 'components-1',
            name: 'components',
            type: 'folder',
            children: []
        },
        {
            id: 'public-1',
            name: 'public',
            type: 'folder',
            children: []
        },
        { id: 'package-1', name: 'package.json', type: 'file' },
        { id: 'tsconfig-1', name: 'tsconfig.json', type: 'file' },
        { id: 'nuxt-config-1', name: 'nuxt.config.ts', type: 'file' }
    ]
})

const createRemixStructure = (): FileFolderItem => ({
    id: 'root',
    name: 'Remix',
    type: 'folder',
    children: [
        {
            id: 'app-1',
            name: 'app',
            type: 'folder',
            children: [
                { id: 'root-1', name: 'root.tsx', type: 'file' },
                {
                    id: 'routes-1',
                    name: 'routes',
                    type: 'folder',
                    children: [
                        { id: 'index-1', name: 'index.tsx', type: 'file' }
                    ]
                }
            ]
        },
        { id: 'package-1', name: 'package.json', type: 'file' },
        { id: 'tsconfig-1', name: 'tsconfig.json', type: 'file' },
        { id: 'remix-config-1', name: 'remix.config.js', type: 'file' }
    ]
})

const createAstroStructure = (): FileFolderItem => ({
    id: 'root',
    name: 'Astro',
    type: 'folder',
    children: [
        {
            id: 'src-1',
            name: 'src',
            type: 'folder',
            children: [
                {
                    id: 'pages-1',
                    name: 'pages',
                    type: 'folder',
                    children: [
                        { id: 'index-1', name: 'index.astro', type: 'file' }
                    ]
                },
                {
                    id: 'components-1',
                    name: 'components',
                    type: 'folder',
                    children: []
                },
                {
                    id: 'layouts-1',
                    name: 'layouts',
                    type: 'folder',
                    children: []
                }
            ]
        },
        {
            id: 'public-1',
            name: 'public',
            type: 'folder',
            children: []
        },
        { id: 'package-1', name: 'package.json', type: 'file' },
        { id: 'tsconfig-1', name: 'tsconfig.json', type: 'file' },
        { id: 'astro-config-1', name: 'astro.config.mjs', type: 'file' }
    ]
})

export const getFrameworkStructure = (framework: string): FileFolderItem => {
    const structureGenerators: { [key: string]: () => FileFolderItem } = {
        'Next.js': createNextjsStructure,
        'React': createReactStructure,
        'Vue': createVueStructure,
        'Angular': createAngularStructure,
        'Svelte': createSvelteStructure,
        'Nuxt': createNuxtStructure,
        'Remix': createRemixStructure,
        'Astro': createAstroStructure
    }

    const generator = structureGenerators[framework]
    if (!generator) {
        throw new Error(`Unsupported framework: ${framework}`)
    }

    return generator()
}