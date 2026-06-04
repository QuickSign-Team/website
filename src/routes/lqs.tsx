import createSignerModule, { type LqsModule } from '../lqs.js';

const Lqs: Component<
    {},
    {
        file: File | null;
        fileName: string;
        fileSize: string;
        identifier: string;
        status: string;
        log: string;
        busy: boolean;
        canSign: boolean;
        downloadUrl: string;
        downloadName: string;
        signer: Promise<LqsModule> | null;
        onFileChange: (event: Event) => void;
        onIdentifierInput: (event: Event) => void;
        signSelectedFile: () => Promise<void>;
    }
> = function() {
    this.file = null;
    this.fileName = '';
    this.fileSize = '';
    this.identifier = 'com.example.app';
    this.status = 'Choose a mach-o executable to sign.';
    this.log = '';
    this.busy = false;
    this.canSign = false;
    this.downloadUrl = '';
    this.downloadName = '';
    this.signer = null;

    this.css = `
    .hero {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 100px 50px;
        overflow: hidden;
        text-align: center;
    }

    .hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(136, 176, 255, 0.3), rgba(178, 89, 232, 0.45));
        opacity: 0.5;
        z-index: 0;
        background-size: cover;
    }

    .hero-text {
        position: relative;
        z-index: 1;
        max-width: 680px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hero-text h2 {
        font-size: 2.5rem;
        line-height: 1.2;
        font-weight: 500;
    }

    .hero-text h1 {
        --bg-size: 400%;
        font-size: 5rem;
        animation: move-bg 10s linear infinite;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 650;
    }

    @keyframes move-bg {
        to {
            background-position: var(--bg-size) 0;
        }
    }

    .intro {
        margin: 20px 0;
        font-size: 1.25rem;
        line-height: 1.6;
        font-weight: normal;
    }

    .btn-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
    }

    .more-btn,
    .more-btn:visited,
    .download-link,
    .download-link:visited {
        display: inline-block;
        background: linear-gradient(45deg, var(--surface1), var(--surface1));
        color: var(--accent0);
        padding: 10px 20px;
        border-radius: 99px;
        font-weight: bold;
        text-decoration: none;
        transition: background 0.3s, color 0.3s;
        cursor: pointer;
        border: 2px solid transparent;
        background-clip: padding-box;
        box-shadow: 0 0 0 2px var(--accent0);
        font: inherit;
    }

    .more-btn:hover,
    .download-link:hover {
        background: linear-gradient(45deg, var(--accent0), var(--accent1));
        transition: background 0.3s, color 0.3s;
        color: #fff;
    }

    .signer {
        background-color: var(--bg);
        padding: 50px 0;
    }

    .signer-container {
        width: min(920px, calc(100vw - 32px));
        margin: 0 auto;
    }

    .panel {
        background: var(--surface0);
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
        padding: 1.5rem;
        display: grid;
        gap: 18px;
        transition: box-shadow ease 0.3s;
    }

    .file-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 14px;
        align-items: center;
    }

    .field-stack {
        display: grid;
        gap: 14px;
    }

    .field-label {
        display: grid;
        gap: 8px;
    }

    .field-title {
        color: var(--subtext0);
        font-size: 0.95rem;
        font-weight: 650;
    }

    .file-field,
    .identifier-field {
        min-height: 58px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 16px;
        border-radius: 10px;
        background: var(--surface1);
    }

    .identifier-field {
        width: 100%;
        border: 0;
        color: var(--text);
        font: inherit;
        outline: none;
    }

    .identifier-field:focus {
        box-shadow: 0 0 0 2px var(--accent0);
    }

    .file-meta {
        min-width: 0;
    }

    .file-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 650;
    }

    .file-size {
        color: var(--subtext0);
        font-size: 0.9rem;
        margin-top: 4px;
    }

    input[type="file"] {
        max-width: 260px;
        color: var(--subtext0);
    }

    input[type="file"]::file-selector-button {
        border: 0;
        border-radius: 999px;
        background: var(--accent0);
        color: var(--bg);
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        margin-right: 12px;
        padding: 8px 14px;
    }

    button.more-btn {
        color: var(--accent0);
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
    }

    .status {
        color: var(--text);
        line-height: 1.5;
    }

    .log {
        min-height: 100px;
        max-height: 220px;
        overflow: auto;
        border-radius: 8px;
        background: #0b0b0d;
        color: #d9e2ff;
        padding: 14px;
        white-space: pre-wrap;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 0.9rem;
        line-height: 1.45;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
    }

    .actions:empty {
        display: none;
    }

    .post-sign {
        color: var(--subtext0);
        line-height: 1.5;
    }

    .post-sign code {
        display: block;
        margin-top: 8px;
        overflow-x: auto;
        border-radius: 8px;
        background: #0b0b0d;
        color: #d9e2ff;
        padding: 10px;
        white-space: nowrap;
    }

    @media (max-width: 720px) {
        .hero {
            padding: 80px 24px;
        }

        .file-row {
            align-items: stretch;
            grid-template-columns: 1fr;
            flex-direction: column;
        }

        .hero-text h1 {
            font-size: 4em;
        }

        .intro {
            font-size: 1.4em;
        }

        .file-field {
            flex-direction: column;
            align-items: stretch;
        }

        input[type="file"] {
            max-width: 100%;
        }
    }
    `;

    const resetDownload = () => {
        if (this.downloadUrl) {
            URL.revokeObjectURL(this.downloadUrl);
        }
        this.downloadUrl = '';
        this.downloadName = '';
    };

    const appendLog = (message: string) => {
        this.log = this.log ? `${this.log}\n${message}` : message;
    };

    const getSigner = () => {
        this.signer ??= createSignerModule({
            locateFile: () => '/assets/lqs.wasm',
            print: appendLog,
            printErr: appendLog
        });

        return this.signer;
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    };

    this.onFileChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;
        resetDownload();
        this.file = file;
        this.fileName = file?.name ?? '';
        this.fileSize = file ? formatBytes(file.size) : '';
        this.canSign = !!file && !!this.identifier.trim();
        this.status = file ? 'Ready to sign.' : 'Choose a Mach-O executable to sign.';
        this.log = '';
    };

    this.onIdentifierInput = (event: Event) => {
        const input = event.target as HTMLInputElement;
        resetDownload();
        this.identifier = input.value;
        this.canSign = !!this.file && !!this.identifier.trim();
    };

    const copyStringToHeap = (signer: LqsModule, text: string) => {
        const bytes = new TextEncoder().encode(`${text}\0`);
        const pointer = signer._malloc(bytes.length);
        if (!pointer) {
            throw new Error('Unable to allocate identifier memory.');
        }

        signer.HEAPU8.set(bytes, pointer);
        return pointer;
    };

    this.signSelectedFile = async () => {
        const identifier = this.identifier.trim();
        if (!this.file || !identifier || this.busy) return;

        resetDownload();
        this.busy = true;
        this.canSign = false;
        this.status = 'Loading signer...';
        this.log = '';

        let inputPointer = 0;
        let identifierPointer = 0;
        let outputLengthPointer = 0;
        let outputPointer = 0;

        try {
            const signer = await getSigner();
            const input = new Uint8Array(await this.file.arrayBuffer());

            this.status = 'Signing file...';
            inputPointer = signer._malloc(input.length);
            identifierPointer = copyStringToHeap(signer, identifier);
            outputLengthPointer = signer._malloc(4);

            if (!inputPointer || !outputLengthPointer) {
                throw new Error('Unable to allocate WASM memory.');
            }

            signer.HEAPU8.set(input, inputPointer);
            signer.HEAPU32[outputLengthPointer >> 2] = 0;

            outputPointer = signer._sign_macho_wasm(inputPointer, input.length, identifierPointer, outputLengthPointer);

            const outputLength = signer.HEAPU32[outputLengthPointer >> 2];

            if (!outputPointer || !outputLength) {
                throw new Error('signing failed');
            }

            const signedBytes = signer.HEAPU8.slice(outputPointer, outputPointer + outputLength);
            const blob = new Blob([signedBytes], { type: 'application/octet-stream' });
            this.downloadName = `${this.file.name}_signed`;
            this.downloadUrl = URL.createObjectURL(blob);
            this.status = 'Signed successfully.';
            appendLog(`Wrote ${formatBytes(signedBytes.byteLength)}.`);
        } catch (error) {
            this.status = error instanceof Error ? error.message : 'Signing failed.';
        } finally {
            const signer = this.signer ? await this.signer.catch(() => null) : null;
            if (signer) {
                if (inputPointer) signer._free(inputPointer);
                if (identifierPointer) signer._free(identifierPointer);
                if (outputLengthPointer) signer._free(outputLengthPointer);
                if (outputPointer) signer._free(outputPointer);
            }
            this.busy = false;
            this.canSign = !!this.file && !!this.identifier.trim();
        }
    };

    return (
        <main>
            <section class="hero">
                <div class="hero-text">
                    <h2>QuickSign</h2>
                    <h1>libqsign</h1>
                    <p class="intro">Sign a local mach-o executable in your browser using libqsign compiled to wasm</p>
                </div>
            </section>

            <section class="signer">
                <div class="signer-container">
                    <div class="panel">
                        <div class="file-row">
                            <div class="field-stack">
                                <label class="field-label">
                                    <span class="field-title">Mach-O executable</span>
                                    <span class="file-field">
                                        <span class="file-meta">
                                            <span class="file-name">{use(this.fileName, (name) => name || 'No file selected')}</span>
                                            <span class="file-size">{use(this.fileSize, (size) => size || '')}</span>
                                        </span>
                                        <input type="file" on:change={this.onFileChange} />
                                    </span>
                                </label>

                                <label class="field-label">
                                    <span class="field-title">Code signature identifier</span>
                                    <input class="identifier-field" type="text" value={this.identifier} autocomplete="off" spellcheck="false" on:input={this.onIdentifierInput} />
                                </label>
                            </div>
                            <button class="more-btn" type="button" disabled={use(this.canSign, (canSign) => !canSign)} on:click={this.signSelectedFile}>
                                {use(this.busy, (busy) => busy ? 'Signing...' : 'Sign')}
                            </button>
                        </div>

                        <p class="status">{use(this.status)}</p>
                        <pre class="log">{use(this.log, (log) => log || 'no output yet')}</pre>

                        <div class="actions">
                            {use(this.downloadUrl, (url) =>
                                url ? <a class="download-link" href={url} download={use(this.downloadName)}>Download signed file</a> : <span />
                            )}
                        </div>
                        {use(this.downloadName, (name) =>
                            name ? <p class="post-sign">macOS may quarantine browser downloads. If the signed file exits immediately or is killed, remove the quarantine attribute after downloading:<code>xattr -d com.apple.quarantine ~/Downloads/{name}</code></p> : <span />
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Lqs;
