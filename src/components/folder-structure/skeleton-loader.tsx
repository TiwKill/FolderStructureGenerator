import { Skeleton } from "@/components/ui/skeleton"

export function FolderStructureSkeleton() {
    return (
        <div className="space-y-3 p-4">
            {/* Header skeleton */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>

            {/* Folder structure skeleton */}
            <div className="space-y-2">
                {/* Root folder */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-24" />
                </div>

                {/* Level 1 items */}
                <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-28" />
                    </div>

                    {/* Level 2 items */}
                    <div className="ml-6 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-5 w-22" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-5 w-18" />
                        </div>
                    </div>
                </div>

                {/* More level 1 items */}
                <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function StructurePreviewSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-3/6" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>
        </div>
    )
}

export function TabsSkeleton() {
    return (
        <div className="space-y-4">
            {/* Tabs skeleton */}
            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-36" />
                </div>
                <Skeleton className="h-10 w-10" />
            </div>

            {/* Content skeleton */}
            <div className="border rounded-xl p-6">
                <FolderStructureSkeleton />
            </div>
        </div>
    )
}

export function PageSkeleton() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pt-16">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header skeleton */}
                <div className="text-center space-y-4 mb-8 mt-4">
                    <Skeleton className="h-12 w-96 mx-auto" />
                    <Skeleton className="h-6 w-[600px] mx-auto" />
                </div>

                {/* Main content skeleton */}
                <div className="w-full max-w-5xl mx-auto">
                    <TabsSkeleton />
                </div>

                {/* Footer skeleton */}
                <div className="mt-8 text-center">
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>
            </div>
        </main>
    )
}
