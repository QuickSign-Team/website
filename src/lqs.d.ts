export interface LqsModule {
    _malloc(size: number): number;
    _free(pointer: number): void;
    _sign_macho_wasm(inputPointer: number, inputLength: number, identifierPointer: number, outputLengthPointer: number): number;
    readonly HEAPU8: Uint8Array;
    readonly HEAPU32: Uint32Array;
}

export interface LqsOptions {
    locateFile?: (path: string, scriptDirectory: string) => string;
    print?: (message: string) => void;
    printErr?: (message: string) => void;
}

export default function createSignerModule(options?: LqsOptions): Promise<LqsModule>;
