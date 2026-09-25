# eskopi

eskopi is a prototype low-code platform, built between January and May 2021, for putting together data-driven web applications in the browser instead of hand-coding every form and table. A drag-and-drop page designer lets you arrange controls such as text, number, date and time inputs, text areas, checkboxes, buttons, labels, groups, forms, editable tables and sub-pages, then set their layout, data bindings and JavaScript event handlers in property panels. A database designer defines tables and fields, a database explorer browses the stored records, and a page renderer runs the saved pages as working screens. The front end is a React 17 app from Create React App with its own component library and observer-based state hooks. The back end is a small Express server with JWT sign-in that keeps every entity in memory and saves it to two JSON files. It is a personal experiment rather than a finished product: request authentication is switched off in the server, the API address is hard-coded, and there are no real tests.

> Status: prototype from 2021, not actively maintained.

## Features

- **Page designer** (`page-designer`, also the home route): page tree, control palette, drag-and-drop canvas, outline view, and property panels for width and height, alignment and gap, border, margin and padding, colours, data, table columns and events.
- **Event handlers** written as JavaScript in an in-app code editor (react-simple-code-editor with Prism highlighting).
- **Page renderer** (`page-renderer/<pageId>`): renders a saved page design as a working screen.
- **DB designer** (`db-designer`): create tables and edit their fields.
- **DB explorer** (`db-explorer`): list every collection and view its records.
- **Login and registration** screens backed by `/authentication/sign-in` and `/authentication/register`.
- Tabbed app shell with a side menu built from the saved pages; modules open by URL hash.
- Reusable components: layout primitives, inputs (masked, number, date, time, code), tables with auto-populated and configurable columns, lists, trees, panels, dialogs and slide-down panels.
- Sample modules under `src/module/sample/` (form, list, tree, data grid, database CRUD, sidebar, custom controller and others).
- Browser targets include Internet Explorer 11.

## Tech stack

React 17 · Create React App 4 · CSS Modules · Express 4 · jsonwebtoken · password-hash · imask · Prism · Yarn

## Getting started

Prerequisites: Node.js and Yarn (a `yarn.lock` is committed).

```bash
yarn install
yarn start-server   # API server on http://localhost:4000 (node server.js)
yarn start          # generates src/routing.js, then starts the React dev server on :3000
yarn build          # production build of the React app
yarn test           # CRA test runner (one placeholder test)
```

Environment variable for the server, read from `.env`: `ACCESS_TOKEN_SECRET` (used to sign JWTs on sign-in).

The front end calls the API at `http://localhost:4000`, hard-coded in `src/components/useResource.js`. Data is kept in `.store.json` and `.warehouse.json` in the directory where the server is started; both are gitignored.

## Project structure

```text
server.js                 Express app: CORS, JSON body, /db and /authentication routes, port 4000
service/
  database.js             In-memory entity store with JSON-file persistence and the /db REST router
  authentication.js       Sign-in, register, sign-out and change-password routes
  logger.js               Console logger
scan-module.js            Builds src/routing.js from every src/module/**/index.js
src/
  App.js                  App shell, tabs and hash-based module loading
  components/             UI library, layout, tables, forms, observer and resource hooks
  module/
    page-designer/        Visual page designer
    page-renderer/        Runtime for saved pages
    db-designer/          Table and field designer
    db-explorer/          Record browser
    login/                Login and registration
    sample/               Component and feature samples
public/                   CRA public folder and bundled web fonts
```

## How it works

- **Routing.** `scan-module.js` finds every `index.js` under `src/module/` and writes `src/routing.js`, mapping paths such as `db-designer` or `sample/tree` to their components. The app opens a module from the URL hash in a new tab.
- **Data API.** `service/database.js` treats the URL path as a collection or entity reference and the `a` query parameter as the action: `c` create, `r` read, `u` update, `d` delete, `l` link and `ul` unlink. `GET /db` lists collections, `GET /db/<collection>` returns records filtered by query parameters, and deeper paths read an entity by id and then its properties. Links between entities are stored as id arrays with back-references in `associated_`.
- **System collections.** Users, page designs, pages and tables are stored in the collections `system-users`, `system-page-designs`, `system-pages` and `system-tables`.
- **Persistence.** Every change schedules a debounced (1 second) write of the whole store to `.store.json` and `.warehouse.json`, which are loaded again when the server starts.

## Limitations

- The JWT check in `server.js` is commented out, so every `/db` route is open, and `/authentication/change-password` expects a `req.user` that is never set.
- The API URL is hard-coded to `http://localhost:4000`.
- `service/database.js` requires `uuid`, which is not listed in `package.json` and only resolves through other dependencies.
- The only test is a placeholder render test in `src/App.test.js`.
