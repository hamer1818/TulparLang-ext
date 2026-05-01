# Tulpar VS Code Extension

VS Code support for the [TulparLang](https://github.com/hamer1818/TulparLang) language: syntax highlighting, snippets, run/build/REPL commands, and inline error diagnostics from the Tulpar compiler.

## Features

- **Full Language Server** — `tulpar --lsp` powers diagnostics, hover, completion, go-to-definition, find-references, and rename. The extension auto-spawns the LSP and restarts it when `tulpar.executablePath` or `tulpar.diagnostics.enabled` changes.
- **Syntax highlighting** for the full Tulpar grammar, including the typed-return form `func name(...): int { ... }` that triggers Tulpar's native AOT codegen path.
- **Code snippets** for the whole stdlib surface (functions, loops, error handling, JSON, Wings/Router HTTP, async server, ORM, http_client, OpenAPI, regex, CSV, datetime, package manifest, …) — see the list below.
- **Run / Build / REPL commands** for every Tulpar execution mode:
  - `Tulpar: Run File` — default (silent AOT, falls back to VM).
  - `Tulpar: Run with VM` — `tulpar --vm <file>`.
  - `Tulpar: Build (AOT)` — produces a standalone executable.
  - `Tulpar: Build & Run (AOT)` — `tulpar --aot <file>`.
  - `Tulpar: Open REPL`.
- **Status bar buttons** for the two most common actions: **▶ Tulpar Run** and **📦 Tulpar Build**.

## Usage

1. Install the extension (`.vsix`) or open this folder and press `F5` to launch a development host.
2. Make sure the `tulpar` (or `tulpar.exe`) compiler is on your `PATH`, or set `tulpar.executablePath` in settings.
3. Open any `.tpr` file. Use the status bar (`▶ Tulpar Run`, `📦 Tulpar Build`) or the Command Palette to invoke commands.

## Configuration

| Setting | Default | Purpose |
| --- | --- | --- |
| `tulpar.executablePath` | `tulpar` | Absolute path to the Tulpar compiler if not on `PATH` (e.g. `D:/yazilim/Tulpar/tulpar.exe`). |
| `tulpar.runCommand` | *(empty)* | Optional override for `Tulpar: Run File`. Use `${file}` for the active file. Empty = use the built-in default. |
| `tulpar.diagnostics.enabled` | `true` | Surface compiler errors in the Problems panel. |
| `tulpar.diagnostics.runOnSave` | `true` | Re-run the diagnostic check whenever a `.tpr` file is saved. |
| `tulpar.aot.outputName` | *(empty)* | Output executable name for `Tulpar: Build (AOT)`. Empty = derived from source file name. |

## Snippets

Type the prefix and press Tab:

| Prefix | Expands to |
| --- | --- |
| `tmain` | `func main() { … }` |
| `tfunci` | Typed-return function (`func name(...): int { … }`) — uses native AOT codegen |
| `tfunc` | Untyped function |
| `tif` / `tifelse` | If / If-else |
| `tfor` / `tforin` / `twhile` | Loops |
| `ttry` | Try / catch / finally |
| `ttype` | Custom type definition |
| `tjson` / `tjsonarr` | JSON object / array |
| `timport` | Import statement |
| `tread` / `twrite` | File I/O |
| `tthread` | Thread + mutex skeleton |
| `twings` | Wings HTTP route |
| `trouter` | `lib/router.tpr` GET endpoint |
| `tapi` | FastAPI-style `lib/tulpar_api.tpr` scaffold |
| `tsocket` | TCP socket server |
| `tasync` | Async block |
| `tmw` | HTTP middleware |
| `tdb` | SQLite CRUD |
| `tp` / `tps` | `print(...)` / `print(toString(...))` |
| `twingsa` | Multi-threaded Wings server (`listen_async`) |
| `topenapi` | Auto-generated OpenAPI 3.0 doc handler |
| `tloginfo` / `tlogerror` | Wings structured JSON logger |
| `thttpget` / `thttppost` | Outbound HTTP client (with optional JSON parse) |
| `torm` | Active-Record style mini-ORM over SQLite |
| `tnow` | `now_iso8601()` UTC timestamp |
| `trxc` | `regex_capture` skeleton |
| `tcsv` | RFC 4180 CSV parse loop |
| `tglob` | `file_glob` enumeration |
| `tpkgdep` | `tulpar.toml` `[dependencies]` line |
| `tarena` | Per-request arena scope (`arena_save` / `arena_restore`) |

## Language Server

The extension speaks LSP to the bundled `tulpar --lsp` server. You get:

- **Diagnostics** — parser + codegen errors with structured `range` (no more line-1 fallback) and the same did-you-mean / Rust-style hint that the CLI shows.
- **Hover** — function signatures (user-defined + 80+ builtins) with leading-comment doc strings.
- **Completion** — user functions, builtins, keywords, lib modules.
- **Go-to-definition** (`F12`) — jump from a call site to its declaration.
- **Find references** — see every call site of a function across the file.
- **Rename** (`F2`) — atomic renames across declaration + every call site.

Trigger:
- The LSP restarts automatically when `tulpar.executablePath` or `tulpar.diagnostics.enabled` changes — no window reload needed.
- Set `tulpar.diagnostics.enabled` to `false` to disable the LSP entirely.

## Examples

Tulpar language examples in the upstream repo:

- [Math & Logic](https://github.com/hamer1818/TulparLang/tree/main/examples/04_math_logic.tpr)
- [Data Structures](https://github.com/hamer1818/TulparLang/tree/main/examples/06_data_structures.tpr)
- [Try-Catch](https://github.com/hamer1818/TulparLang/tree/main/examples/10_try_catch.tpr)
- [Router App](https://github.com/hamer1818/TulparLang/tree/main/examples/11_router_app.tpr)
- [Tulpar API Demo](https://github.com/hamer1818/TulparLang/tree/main/examples/tulpar_api_demo.tpr)

## Notes

This extension currently uses the Tulpar compiler as an external diagnostic source rather than a full Language Server. IntelliSense, hover docs, go-to-definition and rename are not provided yet — adding an LSP would be the natural next step.
