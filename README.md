# Tulpar VS Code Extension

Basic VS Code support for the Tulpar language: syntax highlighting, snippets, and a "Run Tulpar File" command.

## Features

- **Syntax Highlighting**: Full support for Tulpar keywords, types (including `bigint` and `json`), operators, and built-in functions
- **Code Snippets**: Quick templates for common patterns (functions, loops, error handling, JSON, threading, HTTP routes, database operations)
- **Run Command**: Execute Tulpar files directly from VS Code
- **Status Bar Integration**: Quick access button to run the current file

## Usage

- Install the extension or run it in development mode (F5)
- Your Tulpar files should have the `.tpr` extension
- To run the active file:
  - Use the status bar button (bottom right: "▶ Tulpar: Run")
  - Or use Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → `Run Tulpar File`

## Configuration

- **`tulpar.runCommand`**: Customize the command used to run Tulpar files. Default: `tulpar ${file}`
  - Examples:
    - `tulpar ${file}` - Run via VM (default)
    - `tulpar --aot ${file} out` - Compile to native binary
    - `tulpar --repl` - Start interactive REPL

## Snippets

Available snippets (type prefix and press Tab):

- `tmain` - Main function
- `tif` - If statement
- `tfor` - For loop
- `tfunc` - Function definition
- `timport` - Import statement
- `ttype` - Custom type definition
- `ttry` - Try-catch-finally error handling
- `tjson` - JSON object literal
- `tread` / `tfileread` - Read file
- `twrite` / `tfilewrite` - Write file
- `tthread` - Threading with mutex example
- `twings` - Wings HTTP route
- `tdb` - Database CRUD operations

## Examples

Check out the Tulpar language examples in the main repository:
- [Math & Logic](https://github.com/hamer1818/TulparLang/tree/main/examples/04_math_logic.tpr)
- [Data Structures](https://github.com/hamer1818/TulparLang/tree/main/examples/06_data_structures.tpr)
- [Try-Catch](https://github.com/hamer1818/TulparLang/tree/main/examples/10_try_catch.tpr)
- [Router App](https://github.com/hamer1818/TulparLang/tree/main/examples/11_router_app.tpr)

## Feature Coverage

This extension supports the following Tulpar language features:

### Keywords
✅ `if`, `else`, `for`, `while`, `return`, `break`, `continue`, `func`, `import`, `type`, `try`, `catch`, `finally`, `throw`

### Types
✅ `int`, `float`, `str`, `bool`, `bigint`, `json`, `array`, `arrayInt`, `arrayFloat`, `arrayStr`, `arrayBool`, `arrayJson`

### Built-in Functions
✅ Syntax highlighting for all built-in functions including:
- I/O: `print`, `input`, `inputInt`, `inputFloat`
- Type Conversion: `toInt`, `toFloat`, `toString`, `toBool`
- Math: `abs`, `sqrt`, `pow`, `sin`, `cos`, `tan`, `log`, `exp`, `floor`, `ceil`, `round`, `random`, `randint`, `min`, `max`
- String: `length`, `upper`, `lower`, `trim`, `split`, `join`, `replace`, `substring`, `contains`, `startsWith`, `endsWith`, `indexOf`
- Array: `push`, `pop`, `length`, `range`
- JSON: `toJson`, `fromJson`
- Time: `timestamp`, `time_ms`, `clock_ms`, `sleep`
- File: `file_read`, `file_write`, `file_exists`, `file_delete`
- Threading: `thread_create`, `mutex_create`, `mutex_lock`, `mutex_unlock`
- Network: `socket_server`, `socket_accept`, `socket_receive`, `socket_send`, `socket_close`
- HTTP/Wings: `get`, `post`, `listen`, `route_get`, `route_post`, `api_get`, `api_post`, `api_run`, `api_json_response`
- Database: `db_open`, `db_close`, `db_query`, `db_execute`

### Execution Modes
✅ Configurable run command supporting:
- VM mode (default): `tulpar ${file}`
- AOT compilation: `tulpar --aot ${file} out`
- REPL mode: `tulpar --repl`

## Notes

- This extension provides basic language support. For advanced features like IntelliSense, hover documentation, and go-to-definition, consider adding an LSP server in the future.
