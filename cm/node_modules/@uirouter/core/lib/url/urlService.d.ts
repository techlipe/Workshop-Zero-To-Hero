/**
 * @coreapi
 * @module url
 */ /** */
import { UIRouter } from '../router';
import { LocationServices, LocationConfig } from '../common/coreservices';
import { UrlConfigApi, UrlSyncApi, UrlRulesApi, UrlParts, MatchResult } from './interface';
/**
 * API for URL management
 */
export declare class UrlService implements LocationServices, UrlSyncApi {
    /** @hidden */
    static locationServiceStub: LocationServices;
    /** @hidden */
    static locationConfigStub: LocationConfig;
    /**
     * A nested API for managing URL rules and rewrites
     *
     * See: [[UrlRulesApi]] for details
     */
    rules: UrlRulesApi;
    /**
     * A nested API to configure the URL and retrieve URL information
     *
     * See: [[UrlConfigApi]] for details
     */
    config: UrlConfigApi;
    /** @hidden */
    private router;
    /** @hidden */
    constructor(router: UIRouter, lateBind?: boolean);
    /** @inheritdoc */
    url(): string;
    /** @inheritdoc */
    url(newurl: string, replace?: boolean, state?: any): void;
    /** @inheritdoc */
    path(): string;
    /** @inheritdoc */
    search(): {
        [key: string]: any;
    };
    /** @inheritdoc */
    hash(): string;
    /** @inheritdoc */
    onChange(callback: Function): Function;
    /**
     * Returns the current URL parts
     *
     * This method returns the current URL components as a [[UrlParts]] object.
     *
     * @returns the current url parts
     */
    parts(): UrlParts;
    dispose(): void;
    /** @inheritdoc */
    sync(evt?: any): void;
    /** @inheritdoc */
    listen(enabled?: boolean): Function;
    /** @inheritdoc */
    deferIntercept(defer?: boolean): void;
    /** @inheritdoc */
    match(urlParts: UrlParts): MatchResult;
}
