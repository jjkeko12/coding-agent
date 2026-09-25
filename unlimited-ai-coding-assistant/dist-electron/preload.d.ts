import { OpenDialogOptions, SaveDialogOptions } from 'electron';
interface ElectronAPI {
    platform: NodeJS.Platform;
    versions: {
        node: string;
        chrome: string;
        electron: string;
    };
    openDialog: (options?: OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>;
    saveDialog: (options?: SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>;
    openExternal: (url: string) => Promise<boolean>;
    getAppPath: () => Promise<{
        userData: string;
        documents: string;
        desktop: string;
        home: string;
        downloads: string;
    }>;
    readFile: (filePath: string) => Promise<string>;
    writeFile: (filePath: string, content: string) => Promise<boolean>;
    readDirectory: (dirPath: string) => Promise<Array<{
        name: string;
        isDirectory: boolean;
        path: string;
    }>>;
    send: (channel: string, data: any) => void;
    receive: (channel: string, func: (...args: any[]) => void) => void;
}
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
export {};
//# sourceMappingURL=preload.d.ts.map