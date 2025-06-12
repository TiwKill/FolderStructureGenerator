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

const createFastAPIStructure = (): FileItem => ({
    "id": "root",
    "name": "fastapi-project",
    "type": "folder",
    "children": [
        {
            "id": "app",
            "name": "app",
            "type": "folder",
            "children": [
                {
                    "id": "app_api",
                    "name": "api",
                    "type": "folder",
                    "children": [
                        {
                            "id": "api_v1",
                            "name": "v1",
                            "type": "folder",
                            "comment": "สำหรับ API Versioning (เช่น v1, v2)",
                            "children": [
                                {
                                    "id": "v1_endpoints",
                                    "name": "endpoints",
                                    "type": "folder",
                                    "comment": "แยกโค้ด API endpoints ตาม resource",
                                    "children": [
                                        {
                                            "id": "endpoints_items",
                                            "name": "items.py",
                                            "type": "file",
                                            "comment": "API endpoints สำหรับ Items (GET, POST, PUT, DELETE)"
                                        },
                                        {
                                            "id": "endpoints_users",
                                            "name": "users.py",
                                            "type": "file",
                                            "comment": "API endpoints สำหรับ Users (เช่น การลงทะเบียน, เข้าสู่ระบบ)"
                                        },
                                        {
                                            "id": "endpoints_init",
                                            "name": "__init__.py",
                                            "type": "file"
                                        }
                                    ]
                                },
                                {
                                    "id": "v1_deps",
                                    "name": "deps.py",
                                    "type": "file",
                                    "comment": "ฟังก์ชัน Dependencies ที่ใช้ร่วมกัน (เช่น DB Session, Auth)"
                                },
                                {
                                    "id": "v1_init",
                                    "name": "__init__.py",
                                    "type": "file"
                                }
                            ]
                        },
                        {
                            "id": "api_init",
                            "name": "__init__.py",
                            "type": "file"
                        }
                    ]
                },
                {
                    "id": "app_core",
                    "name": "core",
                    "type": "folder",
                    "comment": "โค้ดหลักและการตั้งค่า Global",
                    "children": [
                        {
                            "id": "core_config",
                            "name": "config.py",
                            "type": "file",
                            "comment": "การตั้งค่าโปรเจกต์และ Environment Variables"
                        },
                        {
                            "id": "core_security",
                            "name": "security.py",
                            "type": "file",
                            "comment": "ฟังก์ชันเกี่ยวกับความปลอดภัย (เช่น JWT, Password Hashing)"
                        },
                        {
                            "id": "core_init",
                            "name": "__init__.py",
                            "type": "file"
                        }
                    ]
                },
                {
                    "id": "app_crud",
                    "name": "crud",
                    "type": "folder",
                    "comment": "Business logic และ Database operations (Create, Read, Update, Delete)",
                    "children": [
                        {
                            "id": "crud_item",
                            "name": "item.py",
                            "type": "file",
                            "comment": "CRUD operations สำหรับ Item model"
                        },
                        {
                            "id": "crud_user",
                            "name": "user.py",
                            "type": "file",
                            "comment": "CRUD operations สำหรับ User model"
                        },
                        {
                            "id": "crud_init",
                            "name": "__init__.py",
                            "type": "file"
                        }
                    ]
                },
                {
                    "id": "app_db",
                    "name": "db",
                    "type": "folder",
                    "comment": "การตั้งค่าฐานข้อมูล",
                    "children": [
                        {
                            "id": "db_base",
                            "name": "base.py",
                            "type": "file",
                            "comment": "Base class สำหรับ SQLAlchemy Models (สำหรับ Alembic)"
                        },
                        {
                            "id": "db_session",
                            "name": "session.py",
                            "type": "file",
                            "comment": "การสร้าง Database Session และ Engine"
                        },
                        {
                            "id": "db_init_db",
                            "name": "init_db.py",
                            "type": "file",
                            "comment": "สคริปต์สำหรับ initial data หรือสร้างตารางครั้งแรก"
                        },
                        {
                            "id": "db_init",
                            "name": "__init__.py",
                            "type": "file"
                        }
                    ]
                },
                {
                    "id": "app_models",
                    "name": "models",
                    "type": "folder",
                    "comment": "SQLAlchemy ORM models หรือ Data Models อื่นๆ",
                    "children": [
                        {
                            "id": "models_item",
                            "name": "item.py",
                            "type": "file",
                            "comment": "Database model สำหรับ Item"
                        },
                        {
                            "id": "models_user",
                            "name": "user.py",
                            "type": "file",
                            "comment": "Database model สำหรับ User"
                        },
                        {
                            "id": "models_init",
                            "name": "__init__.py",
                            "type": "file"
                        }
                    ]
                },
                {
                    "id": "app_schemas",
                    "name": "schemas",
                    "type": "folder",
                    "comment": "Pydantic models สำหรับ Request/Response/Data validation",
                    "children": [
                        {
                            "id": "schemas_item",
                            "name": "item.py",
                            "type": "file",
                            "comment": "Pydantic schemas สำหรับ Item (เช่น ItemCreate, ItemResponse)"
                        },
                        {
                            "id": "schemas_user",
                            "name": "user.py",
                            "type": "file",
                            "comment": "Pydantic schemas สำหรับ User (เช่น UserCreate, UserLogin)"
                        },
                        {
                            "id": "schemas_init",
                            "name": "__init__.py",
                            "type": "file"
                        }
                    ]
                },
                {
                    "id": "app_tests",
                    "name": "tests",
                    "type": "folder",
                    "comment": "สำหรับ Unit และ Integration Tests",
                    "children": [
                        {
                            "id": "tests_conftest",
                            "name": "conftest.py",
                            "type": "file",
                            "comment": "Fixtures สำหรับ Pytest"
                        },
                        {
                            "id": "tests_items",
                            "name": "test_items.py",
                            "type": "file",
                            "comment": "Test cases สำหรับ API endpoints ของ Items"
                        },
                        {
                            "id": "tests_users",
                            "name": "test_users.py",
                            "type": "file",
                            "comment": "Test cases สำหรับ API endpoints ของ Users"
                        },
                        {
                            "id": "tests_init",
                            "name": "__init__.py",
                            "type": "file"
                        }
                    ]
                },
                {
                    "id": "app_main",
                    "name": "main.py",
                    "type": "file",
                    "comment": "จุดเริ่มต้นของ FastAPI application, รวม Routers และตั้งค่า Global Middleware"
                },
                {
                    "id": "app_init",
                    "name": "__init__.py",
                    "type": "file",
                    "comment": "ทำให้ app เป็น Python package"
                }
            ]
        },
        {
            "id": "alembic",
            "name": "alembic",
            "type": "folder",
            "comment": "สำหรับ Database Migrations (ถ้าใช้ SQLAlchemy)",
            "children": [
                {
                    "id": "alembic_versions",
                    "name": "versions",
                    "type": "folder",
                    "comment": "เก็บไฟล์ migration scripts ที่สร้างโดย Alembic"
                },
                {
                    "id": "alembic_env",
                    "name": "env.py",
                    "type": "file",
                    "comment": "ไฟล์การตั้งค่าหลักของ Alembic"
                },
                {
                    "id": "alembic_script_mako",
                    "name": "script.py.mako",
                    "type": "file",
                    "comment": "Template สำหรับ migration scripts"
                }
            ]
        },
        {
            "id": "dot_env",
            "name": ".env",
            "type": "file",
            "comment": "ไฟล์สำหรับ Environment variables (ข้อมูลที่ละเอียดอ่อนหรือไม่ควร hardcode)"
        },
        {
            "id": "dot_gitignore",
            "name": ".gitignore",
            "type": "file",
            "comment": "ไฟล์กำหนดสิ่งที่ไม่ต้องการให้ Git ติดตาม"
        },
        {
            "id": "dockerfile",
            "name": "Dockerfile",
            "type": "file",
            "comment": "ไฟล์สำหรับสร้าง Docker Image ของแอปพลิเคชัน"
        },
        {
            "id": "docker_compose_yml",
            "name": "docker-compose.yml",
            "type": "file",
            "comment": "ไฟล์สำหรับจัดการหลาย Docker Containers (เช่น แอป + DB)"
        },
        {
            "id": "requirements_txt",
            "name": "requirements.txt",
            "type": "file",
            "comment": "รายการ dependencies ของ Python (สำหรับ pip)"
        },
        {
            "id": "readme_md",
            "name": "README.md",
            "type": "file",
            "comment": "คำอธิบายโปรเจกต์และการใช้งาน"
        },
        {
            "id": "entrypoint_sh",
            "name": "entrypoint.sh",
            "type": "file",
            "comment": "สคริปต์สำหรับการเริ่มต้น Container ใน Docker (เช่น รัน migration ก่อน startup)"
        },
        {
            "id": "pyproject_toml",
            "name": "pyproject.toml",
            "type": "file",
            "comment": "ไฟล์สำหรับการกำหนดค่า build system และ metadata ของโปรเจกต์ (ทางเลือกแทน setup.py)"
        }
    ]
})

const createFastAPIByEssonnaStructure = (): FileItem => ({
    "id": "root",
    "name": "fastapi-project-essonna",
    "created_by": "Essonna",
    "type": "folder",
    "children": [
        {
            "id": "routers",
            "name": "routers",
            "type": "folder",
            "comment": "สำหรับการเข้าถึงข้อมูลจากผู้ใช้งาน",
            "children": [
                {
                    "id": "routers-init",
                    "name": "__init__.py",
                    "type": "file",
                },
                {
                    "id": "routers-auth",
                    "name": "auth.py",
                    "type": "file",
                },
                {
                    "id": "routers-items",
                    "name": "items.py",
                    "type": "file",
                },
            ]
        },
        {
            "id": "schemas",
            "name": "schemas",
            "type": "folder",
            "comment": "สำหรับการตรวจสอบข้อมูลที่ส่งมาจากผู้ใช้งาน",
            "children": [
                {
                    "id": "schemas-init",
                    "name": "__init__.py",
                    "type": "file",
                },
                {
                    "id": "schemas-auth",
                    "name": "auth.py",
                    "type": "file",
                },
            ]
        },
        {
            "id": "models",
            "name": "models",
            "type": "folder",
            "comment": "สำหรับการสร้างตารางข้อมูล",
            "children": [
                {
                    "id": "models-init",
                    "name": "__init__.py",
                    "type": "file",
                },
                {
                    "id": "models-user",
                    "name": "user.py",
                    "type": "file",
                },
            ]
        },
        {
            "id": "controllers",
            "name": "controllers",
            "type": "folder",
            "comment": "สำหรับการจัดการการตรวจสอบข้อมูลที่ส่งมาจากผู้ใช้งาน",
            "children": [
                {
                    "id": "controllers-init",
                    "name": "__init__.py",
                    "type": "file",
                },
                {
                    "id": "controllers-auth",
                    "name": "auth.py",
                    "type": "file",
                },
            ]
        },
        {
            "id": "utils",
            "name": "utils",
            "type": "folder",
            "comment": "สำหรับการทำงานที่มีความซับซ้อน",
            "children": [
                {
                    "id": "utils-init",
                    "name": "__init__.py",
                    "type": "file",
                },
                {
                    "id": "utils-jwt",
                    "name": "jwt.py",
                    "type": "file",
                },
            ]
        },
        {
            "id": "config",
            "name": "config",
            "type": "folder",
            "comment": "สำหรับจัดการการตั้งค่า",
            "children": [
                {
                    "id": "config-init",
                    "name": "__init__.py",
                    "type": "file",
                },
                {
                    "id": "config-settings",
                    "name": "settings.py",
                    "type": "file",
                },
            ]
        },
        {
            "id": "main.py",
            "name": "main.py",
            "type": "file",
            "comment": "สคริปต์สำหรับการเริ่มต้น Container ใน Docker (เช่น รัน migration ก่อน startup)"
        },
        {
            "id": "requirements.txt",
            "name": "requirements.txt",
            "comment": "รายการ dependencies ของ Python (สำหรับ pip)",
            "type": "file",
        },
        {
            "id": "app-env",
            "name": ".env",
            "comment": "ไฟล์สำหรับ Environment variables (ข้อมูลที่ละเอียดอ่อนหรือไม่ควร hardcode)",
            "type": "file",
        },
        {
            "id": "docker-compose.yml",
            "name": "docker-compose.yml",
            "type": "file",
            "comment": "สำหรับจัดการหลาย Docker Containers (เช่น แอป + DB)"
        },
        {
            "id": "dockerfile",
            "name": "Dockerfile",
            "type": "file",
            "comment": "ไฟล์สำหรับสร้าง Docker Image ของแอปพลิเคชัน"
        }
    ]
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
    FastAPI: createFastAPIStructure,
    "FastAPI by Essonna": createFastAPIByEssonnaStructure,
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
