# BeamIO server example

Exemple de backend d'une application basée sur BeamIO.

## Development

1. Install all dependencies

    - Install BeamIO dependencies
    - Install BeamSchemes dependencies
    - Install server dependencies

    ```sh
    cd ../../ && yarn &&
    cd examples/BeamSchemes && yarn &&
    cd ../server && yarn
    ```

2. `yarn dev`

## Deployment with Docker Compose (Traefik)

```yml
version: '3'

services:
  beamio-example-server:
    image: ghcr.io/projectdrinx/beamio-server-example:latest
    restart: always
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.beamio-example-server.rule=Host(`${SERVER_URL}`)'
      - 'traefik.http.routers.beamio-example-server.entrypoints=https'

networks:
  default:
    name: traefik_web
    external: true
```
