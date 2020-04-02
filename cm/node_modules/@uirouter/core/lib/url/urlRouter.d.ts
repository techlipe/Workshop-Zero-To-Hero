import { UrlMatcher } from './urlMatcher';
import { RawParams } from '../params/interface';
import { Disposable } from '../interface';
import { UIRouter } from '../router';
import { UrlRuleFactory } from './urlRule';
import { TargetState } from '../state/targetState';
import { MatchResult, UrlParts, UrlRule, UrlRuleHandlerFn, UrlRulesApi, UrlSyncApi } from './interface';
import { TargetStateDef } from '../state/interface';
/**
 * Updates URL and responds to URL changes
 *
 * ### Deprecation warning:
 * This class is now considered to be an internal API
 * Use the [[UrlService]] instead.
 * For configuring URL rules, use the [[UrlRulesApi]] which can be found as [[UrlService.rules]].
 *
 * This class updates the URL when the state changes.
 * It also responds to changes in the URL.
 */
export declare class UrlRouter implements UrlRulesApi, UrlSyncApi, Disposable {
    /** used to create [[UrlRule]] objects for common cases */
    urlRuleFactory: UrlRuleFactory;
    /** @hidden */ private _router;
    /** @hidden */ private location;
    /** @hidden */ private _sortFn;
    /** @hidden */ private _stopFn;
    /** @hidden */ _rules: UrlRule[];
    /** @hidden */ private _otherwiseFn;
    /** @hidden */ interceptDeferred: boolean;
    /** @hidden */ private _id;
    /** @hidden */ private _sorted;
    /** @hidden */
    constructor(router: UIRouter);
    /** @internalapi */
    dispose(): void;
    /** @inheritdoc */
    sort(compareFn?: (a: UrlRule, b: UrlRule) => number): void;
    private ensureSorted();
    private stableSort(arr, compareFn);
    /**
     * Given a URL, check all rules and return the best [[MatchResult]]
     * @param url
     * @returns {MatchResult}
     */
    match(url: UrlParts): MatchResult;
    /** @inheritdoc */
    sync(evt?: any): void;
    /** @inheritdoc */
    listen(enabled?: boolean): Function;
    /**
     * Internal API.
     * @internalapi
     */
    update(read?: boolean): void;
    /**
     * Internal API.
     *
     * Pushes a new location to the browser history.
     *
     * @internalapi
     * @param urlMatcher
     * @param params
     * @param options
     */
    push(urlMatcher: UrlMatcher, params?: RawParams, options?: {
        replace?: string | boolean;
    }): void;
    /**
     * Builds and returns a URL with interpolated parameters
     *
     * #### Example:
     * ```js
     * matcher = $umf.compile("/about/:person");
     * params = { person: "bob" };
     * $bob = $urlRouter.href(matcher, params);
     * // $bob == "/about/bob";
     * ```
     *
     * @param urlMatcher The [[UrlMatcher]] object which is used as the template of the URL to generate.
     * @param params An object of parameter values to fill the matcher's required parameters.
     * @param options Options object. The options are:
     *
     * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
     *
     * @returns Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
     */
    href(urlMatcher: UrlMatcher, params?: any, options?: {
        absolute: boolean;
    }): string;
    /**
     * Manually adds a URL Rule.
     *
     * Usually, a url rule is added using [[StateDeclaration.url]] or [[when]].
     * This api can be used directly for more control (to register a [[BaseUrlRule]], for example).
     * Rules can be created using [[UrlRouter.urlRuleFactory]], or create manually as simple objects.
     *
     * A rule should have a `match` function which returns truthy if the rule matched.
     * It should also have a `handler` function which is invoked if the rule is the best match.
     *
     * @return a function that deregisters the rule
     */
    rule(rule: UrlRule): Function;
    /** @inheritdoc */
    removeRule(rule: any): void;
    /** @inheritdoc */
    rules(): UrlRule[];
    /** @inheritdoc */
    otherwise(handler: string | UrlRuleHandlerFn | TargetState | TargetStateDef): void;
    /** @inheritdoc */
    initial(handler: string | UrlRuleHandlerFn | TargetState | TargetStateDef): void;
    /** @inheritdoc */
    when(matcher: RegExp | UrlMatcher | string, handler: string | UrlRuleHandlerFn, options?: {
        priority: number;
    }): UrlRule;
    /** @inheritdoc */
    deferIntercept(defer?: boolean): void;
}
