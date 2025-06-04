export interface FileFolderItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: FileFolderItem[];
    size?: number;
}

export interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClear?: () => void;
    onExport?: (format: 'tree' | 'json') => void;
} 