export default async function createSignerModule(options = {}) {
    let wasmMemory = null;
    const decoder = new TextDecoder();

    const heapU8 = () => new Uint8Array(wasmMemory.buffer);
    const heapU32 = () => new Uint32Array(wasmMemory.buffer);

    function fdWrite(fd, iov, iovcnt, pnum) {
        const bytes = heapU8();
        const words = heapU32();
        const chunks = [];
        let written = 0;

        for (let index = 0; index < iovcnt; index++) {
            const ptr = words[(iov >> 2) + index * 2];
            const len = words[(iov >> 2) + index * 2 + 1];
            chunks.push(bytes.slice(ptr, ptr + len));
            written += len;
        }

        words[pnum >> 2] = written;
        const message = chunks.map((chunk) => decoder.decode(chunk)).join("").trim();
        if (message) {
            const print = fd === 1 ? options.print || console.log : options.printErr || console.warn;
            print(message);
        }
        return 0;
    }

    function resizeHeap(requestedSize) {
        const currentSize = wasmMemory.buffer.byteLength;
        if (requestedSize <= currentSize) {
            return 1;
        }

        try {
            wasmMemory.grow(Math.ceil((requestedSize - currentSize) / 65536));
            return 1;
        } catch {
            return 0;
        }
    }

    const imports = {
        a: {
            a: fdWrite,
            b: resizeHeap,
        },
        env: {
            _emscripten_resize_heap: resizeHeap,
            emscripten_resize_heap: resizeHeap,
        },
        wasi_snapshot_preview1: {
            fd_write: fdWrite,
        },
    };

    const wasmPath = options.locateFile ? options.locateFile("lqs.wasm", import.meta.url) : "lqs.wasm";
    const wasmUrl = new URL(wasmPath, import.meta.url);

    let instance = null;
    try {
        const result = await WebAssembly.instantiateStreaming(fetch(wasmUrl), imports);
        instance = result.instance;
    } catch {
        const response = await fetch(wasmUrl);
        if (!response.ok) {
            throw new Error(`Failed to load ${wasmUrl}: ${response.status}`);
        }
        const bytes = await response.arrayBuffer();
        const result = await WebAssembly.instantiate(bytes, imports);
        instance = result.instance;
    }

    const exports = instance.exports;
    wasmMemory = exports.memory || exports.c;
    const init = exports.__wasm_call_ctors || exports.d;
    const malloc = exports._malloc || exports.g;
    const free = exports._free || exports.f;
    const signMachO = exports._sign_macho_wasm || exports.e;

    if (!wasmMemory || !malloc || !free || !signMachO) {
        throw new Error("WASM signer exports are missing");
    }

    if (init) {
        init();
    }

    return {
        _malloc: malloc,
        _free: free,
        _sign_macho_wasm: signMachO,
        get HEAPU8() {
            return heapU8();
        },
        get HEAPU32() {
            return heapU32();
        },
    };
}
