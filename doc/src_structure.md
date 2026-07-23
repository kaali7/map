# MindElixir Core - Source Code Folder Structure

This document outlines the source code directory structure for the MindElixir project, specifically detailing the `src` folder, backend server layer, dashboard, and application entry points.

---

## Root Level & App Entry Points

- **`index.html`**: The primary mind map editor interface containing the canvas, responsive top header bar with compact purple glowing status light dot, node context toolbar (`290px` wide with dark transparent emoji/icon picker), title popover, and presentation mode engine.
- **`dashboard.html`**: The web application dashboard listing saved mind maps from SQLite DB, featuring title search, interactive card thumbnails, a 3-dot options menu, and a modal dialog for creating new maps.
- **`vite.config.ts`**: Vite build configuration and local API server middleware mounting `/api/mindmaps` endpoints connected to SQLite (`server/db.ts`).
- **`mindmap.db`**: Local SQLite database file storing persistent map records (`id`, `title`, `theme`, `data`, `node_count`, `created_at`, `updated_at`).

---

## Server Layer (`server/`)

- **`db.ts`**: SQLite database interface built with `better-sqlite3`. Provides CRUD functions (`getAllMindmaps`, `getMindmapById`, `saveMindmap`, `deleteMindmap`, `duplicateMindmap`) and automatic schema migrations.

---

## Source Code Directory (`src/`)

### Root Level Files (`src/`)

- **`index.ts`**: The main entry point for the library export. Exports the `MindElixir` class and core functions.
- **`dashboard.ts`**: Frontend controller for `dashboard.html`. Handles fetching map lists from SQLite API, rendering dynamic SVG branch thumbnail cards, full-card click routing, 3-dot dropdown popovers, and modal input handling.
- **`dashboard.css`**: Design system and styles for `dashboard.html` matching dark theme aesthetics (`#121212`), dark glass modal inputs (`#0d1016`), centered empty state buttons, and mobile/tablet responsive media queries.
- **`dev.ts` & `dev.dist.ts`**: Development setup scripts that bind MindElixir to SQLite auto-save triggers (`window.triggerAutoSave`), custom theme persistence, and editor initialization (`initFromDb()`).
- **`index.less`**: The main stylesheet for the core mind map UI elements.
- **`arrow.ts`**: Rendering calculations and SVG logic for drawing custom relationship connection arrows.
- **`branchTests.ts`**: Helper logic and tests for rendering main and sub-branch layout variations (straight, curved, angular).
- **`const.ts`**: Centralized constants, default color swatches, and dark theme variables (`DARK_THEME` with `--bgcolor: #121212`).
- **`docs.ts`**: Example data generation and documentation helpers.
- **`i18n.ts`**: Multi-language internationalization module handling UI translations.
- **`interact.ts`**: Manages user canvas interactions (node dragging, double-click editing, and `toCenter()` viewport auto-centering).
- **`linkDiv.ts`**: Renders SVG connector paths between nodes, computing smooth curves aligned with text box boundaries (`me-tpc`).
- **`methods.ts`**: Core prototype methods attached to the `MindElixir` instance (zoom up to 500%, center view, `getData()`, `init()`).
- **`mouse.ts`**: Canvas panning, mouse wheel zooming, and multi-node marquee selection event handlers.
- **`nodeOperation.ts`**: All CRUD operations for map nodes (add child, add sibling, remove node, edit text, update shape).
- **`summary.ts`**: Summary brace logic grouping multiple sibling nodes visually.
- **`markdown.css`**: Styling rules for markdown-formatted nodes.
- **`vite-env.d.ts`**: TypeScript type declarations for Vite environment variables.

---

## Subdirectories in `src/`

### `exampleData/`
Sample map datasets used for initialization and testing:
- `1.ts`, `2.ts`, `3.ts`, `1.cn.ts`
- `htmlText.ts`, `productLaunch.ts`

### `icons/`
SVG graphics used across the interface:
- `add-circle.svg`, `minus-circle.svg`
- `full.svg`, `zoomin.svg`, `zoomout.svg`

### `plugin/`
Modular plugins extending core map functionality:
- **`contextMenu.ts` / `contextMenu.less`**: Right-click context menu UI (`z-index: 10000`).
- **`exportImage.ts`**: PNG and SVG export utility.
- **`keypress.ts`**: Keyboard navigation shortcut bindings.
- **`nodeDraggable.ts`**: Drag-and-drop node reordering engine.
- **`operationHistory.ts`**: Undo and Redo transaction stack management.
- **`selection.ts`**: Single and multi-node selection manager.
- **`toolBar.ts` / `toolBar.less`**: Built-in canvas navigation toolbar.

### `types/`
TypeScript interface and type definitions:
- **`dom.ts`**: DOM element interface mappings (`Topic`, `Wrapper`, `Parent`).
- **`global.ts`**: Global window and library interface declarations.
- **`index.ts`**: Central exports including `NodeObj` (supports `mediaPos` for `'left' | 'top' | 'right' | 'bottom'`), `MindElixirInstance`, and `MindElixirData`.

### `utils/`
Internal utilities and parsing algorithms:
- **`dom.ts` & `domManipulation.ts`**: DOM creation and shape manipulation helpers (`shapeTpc` sets `data-media-type` and `data-media-pos` attributes).
- **`layout.ts` & `layout-ssr.ts`**: Core layout engine calculating node positions (Left, Right, Side-by-side).
- **`generateBranch.ts`**: SVG path generation computing smooth cubic Bezier S-curves (`M x1 y1 C xControl y1 xControl y2 x2 y2`).
- **`requirementParser.ts`**: Utility parser converting text outlines into MindElixir node structure trees.
- **`panHelper.ts` & `LinkPanHelper.ts`**: Physics and delta calculations for smooth canvas panning.
- **`plaintextConverter.ts` / `plaintextToMindElixir.ts` / `mindElixirToPlaintext.ts`**: Text format converters.
- **`pubsub.ts`**: Internal pub/sub event emitter for decoupled component messaging.
- **`svg.ts`**: Low-level SVG path creation helpers.
- **`theme.ts`**: Theme color palettes and CSS variable injection logic.

### `viselect/`
Embedded marquee box selection engine (`src/` and `utils/` for DOM rectangle intersection calculations).

---

## Web App Interface Features in `index.html`

- **Compact Glowing Status Light (`#db-status-badge`)**:
  - Positioned in the right header bar next to action buttons.
  - Displays as a `22px` circular indicator featuring a glowing purple light dot (`●`) with hover tooltip (`Saved to mindmap.db`).
- **4-Letter Title Formatting**:
  - Truncates header display to first 4 characters + `...` (e.g., `ashw...`) while synchronizing full title in the popover input (`titleInput.value`).
- **Enhanced Node Toolbar (`#node-toolbar`)**:
  - `290px` wide context menu popover with dark transparent emoji grid items (`.ntb-emoji-item`) and vector SVG icon library.
- **Presentation Engine (`#btn-present`)**:
  - Fullscreen node-by-node traversal with focused node zoom levels (Root `1.8x`, Sub-branch `2.5x`, Leaf `3.2x`) and dark glass control panels.
