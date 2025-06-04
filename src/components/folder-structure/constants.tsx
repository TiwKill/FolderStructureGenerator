import { 
    File,
    Image,
    FileText,
    FileCode,
    FileJson,
    Package,
    Music,
    Video,
    Settings,
    Database,
    Archive,
    LucideIcon
} from "lucide-react"
import { FileFolderItem } from '@/types/folder-structure'

interface FileIcon {
    icon: LucideIcon;
    color: string;
}

export const INITIAL_STRUCTURE: FileFolderItem = {
    id: 'root',
    name: 'Project',
    type: 'folder',
    children: [],
}

export const FILE_ICONS: Record<string, FileIcon> = {
    // Images
    'png': { icon: Image, color: 'text-blue-500' },
    'jpg': { icon: Image, color: 'text-blue-500' },
    'jpeg': { icon: Image, color: 'text-blue-500' },
    'gif': { icon: Image, color: 'text-blue-500' },
    'svg': { icon: Image, color: 'text-blue-500' },
    'webp': { icon: Image, color: 'text-blue-500' },
    
    // Documents
    'pdf': { icon: FileText, color: 'text-red-500' },
    'doc': { icon: FileText, color: 'text-blue-600' },
    'docx': { icon: FileText, color: 'text-blue-600' },
    'txt': { icon: FileText, color: 'text-gray-600' },
    'md': { icon: FileText, color: 'text-gray-600' },
    
    // Code
    'js': { icon: FileCode, color: 'text-yellow-500' },
    'jsx': { icon: FileCode, color: 'text-blue-500' },
    'ts': { icon: FileCode, color: 'text-blue-600' },
    'tsx': { icon: FileCode, color: 'text-blue-600' },
    'html': { icon: FileCode, color: 'text-orange-500' },
    'css': { icon: FileCode, color: 'text-blue-400' },
    'scss': { icon: FileCode, color: 'text-pink-500' },
    'json': { icon: FileJson, color: 'text-yellow-600' },
    'yaml': { icon: FileJson, color: 'text-red-400' },
    'yml': { icon: FileJson, color: 'text-red-400' },
    
    // Archives
    'zip': { icon: Archive, color: 'text-yellow-600' },
    'rar': { icon: Archive, color: 'text-yellow-600' },
    '7z': { icon: Archive, color: 'text-yellow-600' },
    'tar': { icon: Archive, color: 'text-yellow-600' },
    'gz': { icon: Archive, color: 'text-yellow-600' },
    
    // Media
    'mp3': { icon: Music, color: 'text-green-500' },
    'wav': { icon: Music, color: 'text-green-500' },
    'mp4': { icon: Video, color: 'text-purple-500' },
    'mov': { icon: Video, color: 'text-purple-500' },
    'avi': { icon: Video, color: 'text-purple-500' },
    
    // Others
    'exe': { icon: Settings, color: 'text-gray-500' },
    'sh': { icon: Settings, color: 'text-gray-500' },
    'sql': { icon: Database, color: 'text-blue-500' },
    'db': { icon: Database, color: 'text-blue-500' },
    
    // Package files
    'package.json': { icon: Package, color: 'text-red-500' },
    'composer.json': { icon: Package, color: 'text-blue-500' },
    'requirements.txt': { icon: Package, color: 'text-green-500' },
} 