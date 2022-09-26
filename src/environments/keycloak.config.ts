import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:7688/',
  realm: 'myapp',
  clientId: 'notify-app'
};

export default keycloakConfig;
