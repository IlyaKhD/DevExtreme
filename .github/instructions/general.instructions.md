---
applyTo: '**'
---

# General Instructions

## Big Picture Architecture
- This is a multi-package monorepo for DevExtreme UI components and tools, supporting Angular, React, Vue, and jQuery.
- Major packages: `devextreme` (core), `devextreme-angular`, `devextreme-react`, `devextreme-vue`, `devextreme-themebuilder`, and `devextreme-monorepo-tools`.
- Apps and demos are under `apps/` (e.g., `apps/angular`, `apps/react`, `apps/vue`, `apps/demos`).
- Each framework package has its own build/test scripts and may have custom setup steps.

## Developer Workflows
- Use `pnpm` for all package management and scripts. Do not use `npm` or `yarn`.
- To set up the repo: `pnpm install` from the root.
- To build all packages: `pnpm run build` (or `pnpm run build -w=devextreme` for core only).
- To run all demos: `pnpm run all:build-dev` then `pnpm run launch-demo` (see `apps/demos/README.md`).
- For playgrounds: build the relevant package (`pnpm run pack -w=devextreme-<framework>`) then run the app from `apps/<framework>`.
- For bundles: use `pnpm run prepare-bundles` and revert with `pnpm run prepare-js`.

## Project-Specific Conventions
- All scripts and builds are managed via `pnpm` workspaces. Use `-w=<package>` to target specific packages.
- Framework-specific packages (Angular, React, Vue) have their own README and setup instructions.
- Demos use SystemJS and can be run with or without bundles for faster launch/debugging.
- The repo uses MIT licensing for most packages; see individual package READMEs for details.

## Integration Points & Dependencies
- External dependencies are managed in each package's `package.json`.
- Theme customization is handled via `devextreme-themebuilder` (see its README).
- Monorepo tools for development are in `devextreme-monorepo-tools`.
- Demo gallery and documentation are available at https://js.devexpress.com/Demos/WidgetsGallery and https://js.devexpress.com/Documentation.

## Examples & Patterns
- To build and run Angular playground:
  ```sh
  pnpm run pack -w=devextreme-angular
  cd apps/angular
  pnpm run start
  ```
- To build and run React playground:
  ```sh
  pnpm run pack -w=devextreme-react
  cd apps/react
  pnpm run start
  ```
- To launch all demos:
  ```sh
  pnpm run all:build-dev
  pnpm run launch-demo
  ```

## Key Files & Directories
- `apps/` — playgrounds and demos for each framework
- `packages/` — core and framework-specific packages
- `artifacts/` — build outputs (CSS, JS, etc.)
- `tools/` — scripts and generators for development
- `README.md` — high-level project info
- Each package has its own `README.md` for framework-specific details

---
For more details, see the individual package READMEs and `apps/demos/README.md`. If a workflow or pattern is unclear, ask for clarification or check the relevant README.
