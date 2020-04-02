/**
 * @coreapi
 * @module url
 */ /** */
import { notImplemented } from '../common/coreservices';
import { noop, createProxyFunctions } from '../common/common';
/** @hidden */
var makeStub = function (keys) {
    return keys.reduce(function (acc, key) { return ((acc[key] = notImplemented(key)), acc); }, { dispose: noop });
};
/** @hidden */
var locationServicesFns = ['url', 'path', 'search', 'hash', 'onChange'];
/** @hidden */
var locationConfigFns = ['port', 'protocol', 'host', 'baseHref', 'html5Mode', 'hashPrefix'];
/** @hidden */
var umfFns = ['type', 'caseInsensitive', 'strictMode', 'defaultSquashPolicy'];
/** @hidden */
var rulesFns = ['sort', 'when', 'initial', 'otherwise', 'rules', 'rule', 'removeRule'];
/** @hidden */
var syncFns = ['deferIntercept', 'listen', 'sync', 'match'];
/**
 * API for URL management
 */
var UrlService = /** @class */ (function () {
    /** @hidden */
    function UrlService(router, lateBind) {
        if (lateBind === void 0) { lateBind = true; }
        this.router = router;
        this.rules = {};
        this.config = {};
        // proxy function calls from UrlService to the LocationService/LocationConfig
        var locationServices = function () { return router.locationService; };
        createProxyFunctions(locationServices, this, locationServices, locationServicesFns, lateBind);
        var locationConfig = function () { return router.locationConfig; };
        createProxyFunctions(locationConfig, this.config, locationConfig, locationConfigFns, lateBind);
        var umf = function () { return router.urlMatcherFactory; };
        createProxyFunctions(umf, this.config, umf, umfFns);
        var urlRouter = function () { return router.urlRouter; };
        createProxyFunctions(urlRouter, this.rules, urlRouter, rulesFns);
        createProxyFunctions(urlRouter, this, urlRouter, syncFns);
    }
    UrlService.prototype.url = function (newurl, replace, state) {
        return;
    };
    /** @inheritdoc */
    UrlService.prototype.path = function () {
        return;
    };
    /** @inheritdoc */
    UrlService.prototype.search = function () {
        return;
    };
    /** @inheritdoc */
    UrlService.prototype.hash = function () {
        return;
    };
    /** @inheritdoc */
    UrlService.prototype.onChange = function (callback) {
        return;
    };
    /**
     * Returns the current URL parts
     *
     * This method returns the current URL components as a [[UrlParts]] object.
     *
     * @returns the current url parts
     */
    UrlService.prototype.parts = function () {
        return { path: this.path(), search: this.search(), hash: this.hash() };
    };
    UrlService.prototype.dispose = function () { };
    /** @inheritdoc */
    UrlService.prototype.sync = function (evt) {
        return;
    };
    /** @inheritdoc */
    UrlService.prototype.listen = function (enabled) {
        return;
    };
    /** @inheritdoc */
    UrlService.prototype.deferIntercept = function (defer) {
        return;
    };
    /** @inheritdoc */
    UrlService.prototype.match = function (urlParts) {
        return;
    };
    /** @hidden */
    UrlService.locationServiceStub = makeStub(locationServicesFns);
    /** @hidden */
    UrlService.locationConfigStub = makeStub(locationConfigFns);
    return UrlService;
}());
export { UrlService };
//# sourceMappingURL=urlService.js.map