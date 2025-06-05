"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Keyboard
} from "lucide-react"
import FileFolder from './folder-structure/file-folder'
import ProfileCard from './folder-structure/profile-card'
import { ModeToggle } from './mode-toggle'
import { ClearDialog, ExportDialog, ShortcutsDialog } from './folder-structure/dialogs'
import { useFolderStructure } from './folder-structure/use-folder-structure'
import FrameworkStructure from './framework-structure'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const FolderStructureView = () => {
    const {
        structure,
        openFolders,
        selectedItems,
        clipboard,
        currentEditingId,
        structureDisplay,
        showClearDialog,
        showExportDialog,
        showShortcutsDialog,
        selectedFramework,
        setOpenFolders,
        setCurrentEditingId,
        setShowClearDialog,
        setShowExportDialog,
        setShowShortcutsDialog,
        onCopy,
        onCut,
        onDelete,
        onPaste,
        onAdd,
        handleSelect,
        onRename,
        onExport,
        onImport,
        handleError,
        handleClearStructure,
        handleExport,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleFrameworkSelect,
    } = useFolderStructure()

    return (
        <div className="h-full w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full">
                <div className="flex-1 overflow-auto p-4 lg:p-6 min-h-[50vh] lg:min-h-0 lg:max-w-[65%]">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-4">
                                    <div className="text-lg font-semibold block md:hidden lg:hidden">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/TiwKill.png" />
                                            <AvatarFallback>PP</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 hidden md:block lg:block">
                                    <h2 className="text-lg font-semibold">Folder Structure</h2>
                                </div>
                                <div className="hidden md:block lg:block">
                                    <ProfileCard />
                                </div>
                            </div>
                            <div className='flex gap-2 items-center'>
                                {/* Framework Selection */}
                                <FrameworkStructure 
                                    onFrameworkSelect={handleFrameworkSelect}
                                    selectedFramework={selectedFramework ? {
                                        framework: selectedFramework
                                    } : null}
                                />
                                <ModeToggle />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setShowShortcutsDialog(true)}
                                >
                                    <Keyboard className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowClearDialog(true)}
                                    className="px-3 py-1 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                >
                                    Clear All
                                </Button>
                            </div>
                        </div>
                        <FileFolder
                            item={structure}
                            onAdd={onAdd}
                            onDelete={onDelete}
                            onRename={onRename}
                            selectedItems={selectedItems}
                            onSelect={handleSelect}
                            isSelected={selectedItems.includes(structure.id)}
                            onCopy={onCopy}
                            onPaste={onPaste}
                            onCut={onCut}
                            clipboard={clipboard}
                            currentEditingId={currentEditingId}
                            setCurrentEditingId={setCurrentEditingId}
                            onExport={onExport}
                            onImport={onImport}
                            path=""
                            onError={handleError}
                            openFolders={openFolders}
                            setOpenFolders={setOpenFolders}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            index={0}
                            parentId={null}
                        />
                    </div>
                </div>

                <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 overflow-auto lg:w-[35%] flex-shrink-0">
                    <div className="max-w-3xl mx-auto lg:max-w-none">
                        <h3 className="text-sm font-medium mb-2">Structure Preview</h3>
                        <pre className="text-xs font-mono whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md break-all">
                            {structureDisplay}
                        </pre>
                    </div>
                </div>
            </div>

            <ClearDialog
                open={showClearDialog}
                onOpenChange={setShowClearDialog}
                onClear={handleClearStructure}
            />

            <ExportDialog
                open={showExportDialog}
                onOpenChange={setShowExportDialog}
                onExport={handleExport}
            />

            <ShortcutsDialog
                open={showShortcutsDialog}
                onOpenChange={setShowShortcutsDialog}
            />
        </div>
    )
}

export default FolderStructureView