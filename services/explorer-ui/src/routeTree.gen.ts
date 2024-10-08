/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const TxEffectsIndexLazyImport = createFileRoute('/tx-effects/')()
const ContractsIndexLazyImport = createFileRoute('/contracts/')()
const BlocksIndexLazyImport = createFileRoute('/blocks/')()
const TxEffectsHashLazyImport = createFileRoute('/tx-effects/$hash')()
const ContractsContractAddressLazyImport = createFileRoute(
  '/contracts/$contractAddress',
)()
const BlocksBlockNumberLazyImport = createFileRoute('/blocks/$blockNumber')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const TxEffectsIndexLazyRoute = TxEffectsIndexLazyImport.update({
  path: '/tx-effects/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/tx-effects/index.lazy').then((d) => d.Route),
)

const ContractsIndexLazyRoute = ContractsIndexLazyImport.update({
  path: '/contracts/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/contracts/index.lazy').then((d) => d.Route),
)

const BlocksIndexLazyRoute = BlocksIndexLazyImport.update({
  path: '/blocks/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/blocks/index.lazy').then((d) => d.Route))

const TxEffectsHashLazyRoute = TxEffectsHashLazyImport.update({
  path: '/tx-effects/$hash',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/tx-effects/$hash.lazy').then((d) => d.Route),
)

const ContractsContractAddressLazyRoute =
  ContractsContractAddressLazyImport.update({
    path: '/contracts/$contractAddress',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/contracts/$contractAddress.lazy').then((d) => d.Route),
  )

const BlocksBlockNumberLazyRoute = BlocksBlockNumberLazyImport.update({
  path: '/blocks/$blockNumber',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/blocks/$blockNumber.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/blocks/$blockNumber': {
      id: '/blocks/$blockNumber'
      path: '/blocks/$blockNumber'
      fullPath: '/blocks/$blockNumber'
      preLoaderRoute: typeof BlocksBlockNumberLazyImport
      parentRoute: typeof rootRoute
    }
    '/contracts/$contractAddress': {
      id: '/contracts/$contractAddress'
      path: '/contracts/$contractAddress'
      fullPath: '/contracts/$contractAddress'
      preLoaderRoute: typeof ContractsContractAddressLazyImport
      parentRoute: typeof rootRoute
    }
    '/tx-effects/$hash': {
      id: '/tx-effects/$hash'
      path: '/tx-effects/$hash'
      fullPath: '/tx-effects/$hash'
      preLoaderRoute: typeof TxEffectsHashLazyImport
      parentRoute: typeof rootRoute
    }
    '/blocks/': {
      id: '/blocks/'
      path: '/blocks'
      fullPath: '/blocks'
      preLoaderRoute: typeof BlocksIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/contracts/': {
      id: '/contracts/'
      path: '/contracts'
      fullPath: '/contracts'
      preLoaderRoute: typeof ContractsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/tx-effects/': {
      id: '/tx-effects/'
      path: '/tx-effects'
      fullPath: '/tx-effects'
      preLoaderRoute: typeof TxEffectsIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  BlocksBlockNumberLazyRoute,
  ContractsContractAddressLazyRoute,
  TxEffectsHashLazyRoute,
  BlocksIndexLazyRoute,
  ContractsIndexLazyRoute,
  TxEffectsIndexLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/blocks/$blockNumber",
        "/contracts/$contractAddress",
        "/tx-effects/$hash",
        "/blocks/",
        "/contracts/",
        "/tx-effects/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/blocks/$blockNumber": {
      "filePath": "blocks/$blockNumber.lazy.tsx"
    },
    "/contracts/$contractAddress": {
      "filePath": "contracts/$contractAddress.lazy.tsx"
    },
    "/tx-effects/$hash": {
      "filePath": "tx-effects/$hash.lazy.tsx"
    },
    "/blocks/": {
      "filePath": "blocks/index.lazy.tsx"
    },
    "/contracts/": {
      "filePath": "contracts/index.lazy.tsx"
    },
    "/tx-effects/": {
      "filePath": "tx-effects/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
