# MindElixir Core - Source Code Folder Structure

This document outlines the source code directory structure for the MindElixir project, specifically detailing the `src` folder.

## Root Level Files (`src/`)

- **`index.ts`**: The main entry point for the library. It exports the MindElixir class and its primary functions.
- **`index.less`**: The main stylesheet for the core mind map UI.
- **`dev.ts` & `dev.dist.ts`**: Scripts used for local development and testing environments.
- **`arrow.ts`**: Contains logic and rendering calculations for drawing relationship arrows/connections between nodes.
- **`branchTests.ts`**: Tests and logic for generating different branch layouts and styles (straight, curved, angular).
- **`const.ts`**: Centralized constants used throughout the application (e.g. key codes, class names, theme definitions).
- **`docs.ts`**: Used for documentation generation or examples.
- **`i18n.ts`**: Internationalization module handling multiple languages for UI elements.
- **`interact.ts`**: Handles user interactions like node dragging, double-clicking, and basic UI events.
- **`linkDiv.ts`**: Manages the SVG lines and DOM layers that connect topics.
- **`methods.ts`**: Contains core prototype methods attached to the MindElixir instance (like zoom, center, getting data).
- **`mouse.ts`**: Specifically handles mouse events like panning the canvas, zooming via scroll, and selection.
- **`nodeOperation.ts`**: Contains all CRUD operations for nodes (add, remove, move, edit text).
- **`summary.ts`**: Logic for rendering and handling summary braces that group multiple nodes together.
- **`markdown.css`**: Styling specifically for markdown-formatted nodes.
- **`vite-env.d.ts`**: TypeScript declarations for Vite env variables.

## Subdirectories

### `exampleData/`
Contains sample map data used for testing and demonstration.
- `1.ts`, `2.ts`, `3.ts`, `1.cn.ts`
- `htmlText.ts`, `productLaunch.ts`

### `icons/`
SVG files used internally by the mind map (e.g., expand/collapse icons, navigation arrows).
- `add-circle.svg`, `minus-circle.svg`
- `full.svg`, `zoomin.svg`, `zoomout.svg`, etc.

### `plugin/`
Contains modular features that extend the core map functionality.
- **`contextMenu.ts` / `contextMenu.less`**: Right-click context menu UI and logic (configured with `z-index: 10000` to render above all node elements).
- **`exportImage.ts`**: Logic for exporting the map to PNG/SVG.
- **`keypress.ts`**: Keyboard shortcut bindings (e.g., Tab for child, Enter for sibling).
- **`nodeDraggable.ts`**: Implementation of drag-and-drop node reordering.
- **`operationHistory.ts`**: Undo/Redo stack implementation.
- **`selection.ts`**: Manages selecting single or multiple nodes/arrows.
- **`toolBar.ts` / `toolBar.less`**: Built-in toolbar for map controls.

### `types/`
TypeScript type definitions.
- **`dom.ts`**: Types mapping to the internal HTML elements (Topic, Wrapper, Parent).
- **`global.ts`**: Global interface declarations.
- **`index.ts`**: Central type exports including `NodeObj` (supports `mediaPos` for `'left' | 'top' | 'right' | 'bottom'`), `MindElixirInstance`, and `MindElixirData`.

### `utils/`
Helper functions and internal utilities.
- **`dom.ts` & `domManipulation.ts`**: DOM creation and manipulation helpers (`shapeTpc` sets `data-media-type` and `data-media-pos` on `me-tpc` for node image/icon position control).
- **`layout.ts` & `layout-ssr.ts`**: The core layout engine that calculates node positions (Left, Right, Balanced).
- **`generateBranch.ts`**: Helpers for drawing the SVG paths for branches.
- **`panHelper.ts` & `LinkPanHelper.ts`**: Utilities for canvas panning physics.
- **`plaintextConverter.ts` / `plaintextToMindElixir.ts` / `mindElixirToPlaintext.ts`**: Parsers that convert between plain text outlines and structured mind map JSON.
- **`pubsub.ts`**: An event emitter used internally for decoupled communication.
- **`svg.ts`**: SVG generation helpers.
- **`theme.ts`**: Default theme color palettes (Light & Dark) and CSS variable logic.

### `viselect/`
An embedded version of a selection library (used for marquee selection).
- Contains its own `src/` and `utils/` for DOM rectangle intersections, events, and styling.

