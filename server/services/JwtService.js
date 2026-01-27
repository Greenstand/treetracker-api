const JWTTools = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const log = require('loglevel');
const HttpError = require('../utils/HttpError');

class JWTService {
  static async verify(authorization) {
    if (!authorization) {
      throw new HttpError(
        401,
        'ERROR: Authentication, no token supplied for protected path',
      );
    }
    const tokenArray = authorization.split('Bearer ');
    const token = tokenArray[1];
    let userId; let roles; let policies; let organizationId;
    if (token) {
      // get the public key
      const KEYCLOAK_URL =
        process.env.KEYCLOAK_URL ||
        // 'http://keycloak-service.keycloak:8080/keycloak/realms/treetracker';
        'http://localhost:8081/realms/master';

      const client = jwksClient({
        jwksUri: `${KEYCLOAK_URL}/protocol/openid-connect/certs`,
      });
      const r = await client.getSigningKey();
      const publicKey = r.getPublicKey();

      // Decode the token
      JWTTools.verify(
        token,
        publicKey,
        {
          issuer: KEYCLOAK_URL,
          algorithms: ['RS256'],
        },
        (err, decod) => {
          if (err) {
            log.error(err?.message);
            throw new HttpError(
              401,
              'ERROR: Authentication, token not verified',
            );
          }

          if (!decod?.sub)
            throw new HttpError(
              401,
              'ERROR: Authentication, invalid token received',
            );
          const orgInfo = decod?.organization;
          if (orgInfo) {
            roles = Object.keys(orgInfo).filter((k) => k.startsWith('role_'));
            policies = roles
              .filter((k) => orgInfo[k].policy)
              .map((k) => orgInfo[k].policy);
            policies = [...new Set(policies.flat())];

            const organization = Object.keys(orgInfo).filter(
              (k) => !orgInfo[k].policy,
            );
            if (organization.length > 1) {
              throw new HttpError(
                500,
                'user cannot belong to more than one organization',
              );
            }
            organizationId = orgInfo[organization[0]]?.id;
          } else {
            log.error('no log info found');
            throw new HttpError(
              401,
              'ERROR: Authentication, invalid token received',
            );
          }

          userId = decod.sub;
        },
      );
    } else {
      throw new HttpError(401, 'ERROR: Authentication, invalid token received');
    }
    return { id: userId, organizationId, roles, policies };
  }
}

module.exports = JWTService;
