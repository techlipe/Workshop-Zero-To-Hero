/**
 * @internalapi
 * @module url
 */
/** for typedoc */
import { createProxyFunctions, extend, removeFrom } from '../common/common';
import { isDefined, isFunction, isString } from '../common/predicates';
import { UrlMatcher } from './urlMatcher';
import { is, pattern, val } from '../common/hof';
import { UrlRuleFactory } from './urlRule';
import { TargetState } from '../state/targetState';
import { stripLastPathElement } from '../common';
/** @hidden */
function appendBasePath(url, isHtml5, absolute, baseHref) {
    if (baseHref === '/')
        return url;
    if (isHtml5)
        return stripLastPathElement(baseHref) + url;
    if (absolute)
        return baseHref.slice(1) + url;
    return url;
}
/** @hidden */
var prioritySort = function (a, b) { return (b.priority || 0) - (a.priority || 0); };
/** @hidden */
var typeSort = function (a, b) {
    var weights = { STATE: 4, URLMATCHER: 4, REGEXP: 3, RAW: 2, OTHER: 1 };
    return (weights[a.type] || 0) - (weights[b.type] || 0);
};
/** @hidden */
var urlMatcherSort = function (a, b) {
    return !a.urlMatcher || !b.urlMatcher ? 0 : UrlMatcher.compare(a.urlMatcher, b.urlMatcher);
};
/** @hidden */
var idSort = function (a, b) {
    // Identically sorted STATE and URLMATCHER best rule will be chosen by `matchPriority` after each rule matches the URL
    var useMatchPriority = { STATE: true, URLMATCHER: true };
    var equal = useMatchPriority[a.type] && useMatchPriority[b.type];
    return equal ? 0 : (a.$id || 0) - (b.$id || 0);
};
/**
 * Default rule priority sorting function.
 *
 * Sorts rules by:
 *
 * - Explicit priority (set rule priority using [[UrlRulesApi.when]])
 * - Rule type (STATE: 4, URLMATCHER: 4, REGEXP: 3, RAW: 2, OTHER: 1)
 * - `UrlMatcher` specificity ([[UrlMatcher.compare]]): works for STATE and URLMATCHER types to pick the most specific rule.
 * - Rule registration order (for rule types other than STATE and URLMATCHER)
 *   - Equally sorted State and UrlMatcher rules will each match the URL.
 *     Then, the *best* match is chosen based on how many parameter values were matched.
 *
 * @coreapi
 */
var defaultRuleSortFn;
defaultRuleSortFn = function (a, b) {
    var cmp = prioritySort(a, b);
    if (cmp !== 0)
        return cmp;
    cmp = typeSort(a, b);
    if (cmp !== 0)
        return cmp;
    cmp = urlMatcherSort(a, b);
    if (cmp !== 0)
        return cmp;
    return idSort(a, b);
};
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
var UrlRouter = /** @class */ (function () {
    /** @hidden */
    function UrlRouter(router) {
        /** @hidden */ this._sortFn = defaultRuleSortFn;
        /** @hidden */ this._rules = [];
        /** @hidden */ this.interceptDeferred = false;
        /** @hidden */ this._id = 0;
        /** @hidden */ this._sorted = false;
        this._router = router;
        this.urlRuleFactory = new UrlRuleFactory(router);
        createProxyFunctions(val(UrlRouter.prototype), this, val(this));
    }
    /** @internalapi */
    UrlRouter.prototype.dispose = function () {
        this.listen(false);
        this._rules = [];
        delete this._otherwiseFn;
    };
    /** @inheritdoc */
    UrlRouter.prototype.sort = function (compareFn) {
        this._rules = this.stableSort(this._rules, (this._sortFn = compareFn || this._sortFn));
        this._sorted = true;
    };
    UrlRouter.prototype.ensureSorted = function () {
        this._sorted || this.sort();
    };
    UrlRouter.prototype.stableSort = function (arr, compareFn) {
        var arrOfWrapper = arr.map(function (elem, idx) { return ({ elem: elem, idx: idx }); });
        arrOfWrapper.sort(function (wrapperA, wrapperB) {
            var cmpDiff = compareFn(wrapperA.elem, wrapperB.elem);
            return cmpDiff === 0 ? wrapperA.idx - wrapperB.idx : cmpDiff;
        });
        return arrOfWrapper.map(function (wrapper) { return wrapper.elem; });
    };
    /**
     * Given a URL, check all rules and return the best [[MatchResult]]
     * @param url
     * @returns {MatchResult}
     */
    UrlRouter.prototype.match = function (url) {
        var _this = this;
        this.ensureSorted();
        url = extend({ path: '', search: {}, hash: '' }, url);
        var rules = this.rules();
        if (this._otherwiseFn)
            rules.push(this._otherwiseFn);
        // Checks a single rule. Returns { rule: rule, match: match, weight: weight } if it matched, or undefined
        var checkRule = function (rule) {
            var match = rule.match(url, _this._router);
            return match && { match: match, rule: rule, weight: rule.matchPriority(match) };
        };
        // The rules are pre-sorted.
        // - Find the first matching rule.
        // - Find any other matching rule that sorted *exactly the same*, according to `.sort()`.
        // - Choose the rule with the highest match weight.
        var best;
        for (var i = 0; i < rules.length; i++) {
            // Stop when there is a 'best' rule and the next rule sorts differently than it.
            if (best && this._sortFn(rules[i], best.rule) !== 0)
                break;
            var current = checkRule(rules[i]);
            // Pick the best MatchResult
            best = !best || (current && current.weight > best.weight) ? current : best;
        }
        return best;
    };
    /** @inheritdoc */
    UrlRouter.prototype.sync = function (evt) {
        if (evt && evt.defaultPrevented)
            return;
        var router = this._router, $url = router.urlService, $state = router.stateService;
        var url = {
            path: $url.path(),
            search: $url.search(),
            hash: $url.hash(),
        };
        var best = this.match(url);
        var applyResult = pattern([
            [isString, function (newurl) { return $url.url(newurl, true); }],
            [TargetState.isDef, function (def) { return $state.go(def.state, def.params, def.options); }],
            [is(TargetState), function (target) { return $state.go(target.state(), target.params(), target.options()); }],
        ]);
        applyResult(best && best.rule.handler(best.match, url, router));
    };
    /** @inheritdoc */
    UrlRouter.prototype.listen = function (enabled) {
        var _this = this;
        if (enabled === false) {
            this._stopFn && this._stopFn();
            delete this._stopFn;
        }
        else {
            return (this._stopFn = this._stopFn || this._router.urlService.onChange(function (evt) { return _this.sync(evt); }));
        }
    };
    /**
     * Internal API.
     * @internalapi
     */
    UrlRouter.prototype.update = function (read) {
        var $url = this._router.locationService;
        if (read) {
            this.location = $url.url();
            return;
        }
        if ($url.url() === this.location)
            return;
        $url.url(this.location, true);
    };
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
    UrlRouter.prototype.push = function (urlMatcher, params, options) {
        var replace = options && !!options.replace;
        this._router.urlService.url(urlMatcher.format(params || {}), replace);
    };
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
    UrlRouter.prototype.href = function (urlMatcher, params, options) {
        var url = urlMatcher.format(params);
        if (url == null)
            return null;
        options = options || { absolute: false };
        var cfg = this._router.urlService.config;
        var isHtml5 = cfg.html5Mode();
        if (!isHtml5 && url !== null) {
            url = '#' + cfg.hashPrefix() + url;
        }
        url = appendBasePath(url, isHtml5, options.absolute, cfg.baseHref());
        if (!options.absolute || !url) {
            return url;
        }
        var slash = !isHtml5 && url ? '/' : '';
        var cfgPort = cfg.port();
        var port = (cfgPort === 80 || cfgPort === 443 ? '' : ':' + cfgPort);
        return [cfg.protocol(), '://', cfg.host(), port, slash, url].join('');
    };
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
    UrlRouter.prototype.rule = function (rule) {
        var _this = this;
        if (!UrlRuleFactory.isUrlRule(rule))
            throw new Error('invalid rule');
        rule.$id = this._id++;
        rule.priority = rule.priority || 0;
        this._rules.push(rule);
        this._sorted = false;
        return function () { return _this.removeRule(rule); };
    };
    /** @inheritdoc */
    UrlRouter.prototype.removeRule = function (rule) {
        removeFrom(this._rules, rule);
    };
    /** @inheritdoc */
    UrlRouter.prototype.rules = function () {
        this.ensureSorted();
        return this._rules.slice();
    };
    /** @inheritdoc */
    UrlRouter.prototype.otherwise = function (handler) {
        var handlerFn = getHandlerFn(handler);
        this._otherwiseFn = this.urlRuleFactory.create(val(true), handlerFn);
        this._sorted = false;
    };
    /** @inheritdoc */
    UrlRouter.prototype.initial = function (handler) {
        var handlerFn = getHandlerFn(handler);
        var matchFn = function (urlParts, router) {
            return router.globals.transitionHistory.size() === 0 && !!/^\/?$/.exec(urlParts.path);
        };
        this.rule(this.urlRuleFactory.create(matchFn, handlerFn));
    };
    /** @inheritdoc */
    UrlRouter.prototype.when = function (matcher, handler, options) {
        var rule = this.urlRuleFactory.create(matcher, handler);
        if (isDefined(options && options.priority))
            rule.priority = options.priority;
        this.rule(rule);
        return rule;
    };
    /** @inheritdoc */
    UrlRouter.prototype.deferIntercept = function (defer) {
        if (defer === undefined)
            defer = true;
        this.interceptDeferred = defer;
    };
    return UrlRouter;
}());
export { UrlRouter };
function getHandlerFn(handler) {
    if (!isFunction(handler) && !isString(handler) && !is(TargetState)(handler) && !TargetState.isDef(handler)) {
        throw new Error("'handler' must be a string, function, TargetState, or have a state: 'newtarget' property");
    }
    return isFunction(handler) ? handler : val(handler);
}
//# sourceMappingURL=urlRouter.js.map