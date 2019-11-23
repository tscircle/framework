const jwt = require("jsonwebtoken");
import {Cache} from "../cache/cache";
import * as crypto from 'crypto';
import * as request from 'es6-request'
import JwksRsa = require("jwks-rsa");
import config from "../tscircle/config/auth";
import {AuthProviderInterface} from "./authProviderInterface";
import {AuthUserProviderInterface} from './authUserProviderInterface';


export class JwtAuth implements AuthProviderInterface {

    userProvider: AuthUserProviderInterface;

    defaultError = {
        error: "invalid token",
        status: 401
    };

    constructor(userProvider: AuthUserProviderInterface) {
        this.userProvider = userProvider;
    }

    public authenticate = (req) => {

        const token = req.headers.authorization;
        const tokenhash = crypto.createHash('md5').update(token).digest("hex");

        return Cache.remember(tokenhash, 60 * 30, async () => {
            const user = await this.handleAuthentication(req);
            return user;
        });
    };

    public handleAuthentication = (req) => {
        return new Promise((resolve, reject) => {
            try {
                const jwkClient = JwksRsa({
                    cache: false,
                    strictSsl: true,
                    jwksUri: config.jwks_url
                });

                if (!req.headers.authorization) {
                    reject(this.defaultError)
                }

                const tokenValue = req.headers.authorization.split(" ")[1];

                try {
                    jwt.decode(tokenValue, {complete: true});
                } catch (e) {
                    reject(this.defaultError);
                }

                const kid = this.getKid(jwt.decode(tokenValue, {complete: true}));

                jwkClient.getSigningKey(kid, (error, key: JwksRsa.SigningKey) => {
                    if (key === undefined || error) {
                        reject(this.defaultError);
                    }

                    const signingKey = (key as JwksRsa.CertSigningKey).publicKey || (key as JwksRsa.RsaSigningKey).rsaPublicKey;

                    this.verifyJwt(tokenValue, signingKey)
                        .then(() => {
                            return this.getUserInfo(tokenValue);
                        })
                        .then((user) => {
                            resolve(user);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })

            } catch (error) {
                reject(error);
            }
        });
    };

    private getKid = (decodedToken) => {
        try {
            const kid = decodedToken.header.kid;
            return kid;
        } catch (err) {
            throw this.defaultError;
        }
    };

    private verifyJwt = (token: string, signingKey: string) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, signingKey, {algorithm: config.alg}, (err, decoded) => {
                if (err) {
                    reject(this.defaultError);
                } else {
                    resolve(decoded);
                }
            });
        });
    };

    private getUserInfo = (token: string) => {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        return request.get(config.issuer + 'userinfo', options)
            .then(([body, res]) => {
                return this.userProvider.getUser(JSON.parse(body.toString()));
            })
    }
}
