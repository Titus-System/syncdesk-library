# SyncDesk Library

Biblioteca de integração do [SyncDesk](https://github.com/Titus-System/SyncDesk).

Essa biblioteca fornece recursos para as aplicações frontend do sistema SyncDesk, permitindo a comunicação eficiente e segura entre os componentes do sistema. Ela inclui funcionalidades de autenticação, gerenciamento de requisições para o backend e manipulação de dados, facilitando a construção de interfaces de usuário responsivas e interativas.

## Installation

### Install from npm registry

```sh
npm install @titus/syncdesk
```

### Install locally

```sh
npm run build
npm pack
```

It creates a compressed tarball file in your folder. You can install it in your project with:

```sh
npm install /path/to/your/library-1.0.0.tgz
```

## Publish new version to npm registry

```sh
npm run build && npm publish
```

---

## Auth

If the token expires, the auth module will automatically attempt to refresh it using the refresh token. If the refresh token is also expired or invalid, the `config.onUnauthorized` callback will be triggered, allowing you to handle the unauthorized state (e.g., redirecting to the login page).
