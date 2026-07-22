# MindElixir Core - Source Code Folder Structure

This document outlines the source code directory structure for the MindElixir project, specifically detailing the `src` folder.

## Root Level Files (`src/`)

- **`index.ts`**: The main entry point for the library. It exports the MindElixir class and its primary functions.
- **`index.less`**: The main stylesheet for the core mind map UI.
- **`dev.ts` & `dev.dist.ts`**: Scripts used for local development and testing environments.
- **`arrow.ts`**: Contains logic and rendering calculations for drawing relationship arrows/connections between nodes.
- **`branchTests.ts`**: Tests and logic for generating different branch layouts and styles (straight, curved, angular).
- **`const.ts`**: Centralized constants and theme definitions (Light & Dark) configured with uniform bordered node designs (`--main-bgcolor: '#ffffff'`, `--main-border: '1.5px solid'`), and canvas-matching root background.
- **`docs.ts`**: Used for documentation generation or examples.
- **`i18n.ts`**: Internationalization module handling multiple languages for UI elements.
- **`interact.ts`**: Handles user interactions like node dragging, double-clicking, and canvas view centering (`toCenter` offset calculations relative to `me-nodes`).
- **`linkDiv.ts`**: Manages the SVG lines and DOM layers that connect topics, precisely calculating sub-branch curves from text box boundaries (`me-tpc`).
- **`methods.ts`**: Contains core prototype methods attached to the MindElixir instance (like zoom up to 500% scaleMax, center view, getting data).
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
- **`generateBranch.ts`**: Helpers for drawing SVG paths for main and sub branches. Both `main()` and `sub()` compute smooth cubic Bezier S-curves (`M x1 y1 C xControl y1 xControl y2 x2 y2`) connecting parent edge to child edge.
- **`panHelper.ts` & `LinkPanHelper.ts`**: Utilities for canvas panning physics.
- **`plaintextConverter.ts` / `plaintextToMindElixir.ts` / `mindElixirToPlaintext.ts`**: Parsers that convert between plain text outlines and structured mind map JSON.
- **`pubsub.ts`**: An event emitter used internally for decoupled communication.
- **`svg.ts`**: SVG generation helpers.
- **`theme.ts`**: Default theme color palettes (Light & Dark) and CSS variable logic.

### `index.html` (Application Web App Demo & Responsive Interface)
The main application demo page containing complete UI layout, mobile responsive dock, categorized menu popovers, and presentation system:
- **Responsive Top Header & Two-Pill Navbar**:
  - **Left Pill (`.header-left`)**: Logo `[M]` + Map Title `Camp... ∨` (Title edit toggle & compact truncation to 4-5 letters on mobile).
  - **Right Pill (`.header-right`)**: `[ ↶ Undo ]` `[ ↷ Redo ]` `[ 🖥️ Present ]` `[ : More Options ]`.
  - **Portrait & Landscape Mobile/Tablet Support**: Uses `@media (max-width: 768px), (max-height: 550px) and (max-width: 1024px)` to ensure both vertical and horizontal phone/tablet positions display a clean, un-cluttered 2-pill layout while hiding bulky desktop controls (`.desktop-only`, `#right-toolbar`, `#bottom-left`, `#bottom-right`).
- **Categorized Popover Menu & Viewport Boundary Math**:
  - `#more-options-popover` calculates dynamic right offsets (`popover.style.right = Math.max(8, window.innerWidth - rect.right) + 'px'`, `popover.style.left = 'auto'`) to guarantee the dropdown menu expands leftward under the button and never overflows off the right edge of the screen on any resolution.
  - Divided into clean categories with dividers: Quick Actions (`Share Map`, `Save Map`, `Center View`, `Search Map`, `New Map`), Appearance (`Theme Colors ▸`, `Light/Dark Mode`), Data (`Export JSON`, `Import JSON`), and Danger (`Clear Canvas`).
- **Theme Colors Leftward Flyout & Mobile Inline Expansion**:
  - `#theme-flyout-panel` uses `right: calc(100% + 8px); left: auto;` on desktop to expand to the left of the main popover menu into open viewport space.
  - Expands inline below Theme Colors on mobile/tablet screens to prevent horizontal clipping.
- **Presentation Mode (`#btn-present`)**:
  - Fullscreen slide-by-slide traversal of mind map nodes in hierarchical order.
  - **Dynamic Zoom & Centering (`zoomToNode`)**: Computes unscaled map-local node coordinates `(nodeLocalX, nodeLocalY)` to calculate exact `translate3d(x, y, 0)` offsets for precise viewport centering at depth-based scale levels (Root `1.8x`, Main Branch `2.5x`, Child Nodes `3.2x`).
  - **Focus Blur Effect**: Blurs non-focused nodes (`filter: blur(1.5px); opacity: 0.25`) while keeping the active slide node sharp (`.present-focus`).
  - **Theme Adaptive UI**: Presentation top bar, exit button, and bottom navigation pill automatically adapt between Light Mode (white glassmorphism) and Dark Mode (slate glassmorphism).
  - **Numbered Nav Dots**: The active blue/purple dot expands into a pill displaying the current slide number.
  - **UI Isolation**: Automatically hides header, toolbars, and help buttons (`body.is-presenting`) during presentation mode and restores map centering on exit.

### `viselect/`
An embedded version of a selection library (used for marquee selection).
- Contains its own `src/` and `utils/` for DOM rectangle intersections, events, and styling.


