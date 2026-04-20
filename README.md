# SyncDesk Library

SDK (Software Development Kit) para integração com o [SyncDesk](https://github.com/Titus-System/SyncDesk).

Essa biblioteca fornece recursos para as aplicações frontend do sistema SyncDesk, permitindo a comunicação eficiente e segura entre os componentes do sistema. Ela inclui funcionalidades de autenticação, gerenciamento de requisições para o backend e manipulação de dados, facilitando a construção de interfaces de usuário responsivas e interativas.

## Installation

### Install from npm registry

```sh
npm install @titus-system/syncdesk
```

### Install locally

Alternatively, you can install locally bypassing the npm registry.

```sh
npm run build
npm pack
```

It creates a compressed tarball file in your folder. You can install it in your project with:

```sh
npm install /path/to/your/library-1.0.0.tgz
```

### Configure your project to use the library

This lib requires some configuration to work properly, such as the API base URL.
To do so, you should call the `configLibrary` function in your project, passing the necessary configuration options. For example:

```ts
import { configLibrary } from "@titus-system/syncdesk";
configureLibrary({
  baseURL: 'http://localhost:8000/api', // should not be hardcoded, but in a .env file or similar

  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),

  onTokensRefreshed: (newAccess: string, newRefresh: string) => {
    localStorage.setItem('access_token', newAccess)
    localStorage.setItem('refresh_token', newRefresh)
  },

  onUnauthorized: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'

    // // Mobile-specific logic to clear secure storage and navigate
    // await SecureStore.deleteItemAsync('access_token')
    // router.replace('/login')
  }
})
```

## Publish new version to npm registry

```sh
# You may have to login to npm registry first with `npm login`
npm login

npm run build
npm publish --access public
```

---

## Auth

If the token expires, the auth module will automatically attempt to refresh it using the refresh token. If the refresh token is also expired or invalid, the `config.onUnauthorized` callback will be triggered, allowing you to handle the unauthorized state (e.g., redirecting to the login page).
