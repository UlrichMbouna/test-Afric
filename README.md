# Front AFRic

Application Angular avec pages public (home, login, register) et dashboard privé. Le projet inclut un mode **mock** pour tester sans backend réel.

## Prérequis

- Node.js 20+ recommandé
- npm

## Démarrage

```bash
npm install
ng serve
```

L’application est accessible sur `http://localhost:4200`.

## Comptes de test (mode mock)

Mot de passe commun : `demo1234`

- `jean@finova.test`
- `amina@finova.test`
- `lucas@finova.test`
- `fatou@finova.test`

## Données mock

Les fausses données sont stockées ici :

```
/public/mock/db.json
```

URL directe en dev :

```
http://localhost:4200/mock/db.json
```

## Activer / désactiver le mode mock

Dans `src/environments/environment.ts` :

```ts
mock: true
```

En production (`environment.production.ts`) :

```ts
mock: false
```

## Routes principales

- `/` : Home
- `/login` : Connexion
- `/register` : Inscription
- `/dashboard` : Dashboard (protégé)
- Pages info : `/features`, `/security`, `/pricing`, `/about`, `/cards`, `/business`, `/blog`, `/careers`, `/press`, `/privacy`, `/terms`, `/cookies`, `/license`, `/help`, `/contact`

## Notes

- Le dashboard consomme les données mock si `mock: true`.
- Les transactions et l’utilisateur courant sont stockés en `localStorage` pendant la session.
