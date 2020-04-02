/**
 * @internalapi
 * @module url
 */ /** for typedoc */
import { forEach, extend } from '../common/common';
import { isObject, isDefined, isFunction, isString } from '../common/predicates';
import { UrlMatcher } from './urlMatcher';
import { Param, DefType } from '../params/param';
import { ParamTypes } from '../params/paramTypes';
/**
 * Factory for [[UrlMatcher]] instances.
 *
 * The factory is available to ng1 services as
 * `$urlMatcherFactory` or ng1 providers as `$urlMatcherFactoryProvider`.
 */
var UrlMatcherFactory = /** @class */ (function () {
    function UrlMatcherFactory() {
        var _this = this;
        /** @hidden */ this.paramTypes = new ParamTypes();
        /** @hidden */ this._isCaseInsensitive = false;
        /** @hidden */ this._isStrictMode = true;
        /** @hidden */ this._defaultSquashPolicy = false;
        /** @internalapi Creates a new [[Param]] for a given location (DefType) */
        this.paramFactory = {
            /** Creates a new [[Param]] from a CONFIG block */
            fromConfig: function (id, type, config) { return new Param(id, type, config, DefType.CONFIG, _this); },
            /** Creates a new [[Param]] from a url PATH */
            fromPath: function (id, type, config) { return new Param(id, type, config, DefType.PATH, _this); },
            /** Creates a new [[Param]] from a url SEARCH */
            fromSearch: function (id, type, config) { return new Param(id, type, config, DefType.SEARCH, _this); },
        };
        /** @hidden */
        this._getConfig = function (config) {
            return extend({ strict: _this._isStrictMode, caseInsensitive: _this._isCaseInsensitive }, config);
        };
        extend(this, { UrlMatcher: UrlMatcher, Param: Param });
    }
    /** @inheritdoc */
    UrlMatcherFactory.prototype.caseInsensitive = function (value) {
        return (this._isCaseInsensitive = isDefined(value) ? value : this._isCaseInsensitive);
    };
    /** @inheritdoc */
    UrlMatcherFactory.prototype.strictMode = function (value) {
        return (this._isStrictMode = isDefined(value) ? value : this._isStrictMode);
    };
    /** @inheritdoc */
    UrlMatcherFactory.prototype.defaultSquashPolicy = function (value) {
        if (isDefined(value) && value !== true && value !== false && !isString(value))
            throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
        return (this._defaultSquashPolicy = isDefined(value) ? value : this._defaultSquashPolicy);
    };
    /**
     * Creates a [[UrlMatcher]] for the specified pattern.
     *
     * @param pattern  The URL pattern.
     * @param config  The config object hash.
     * @returns The UrlMatcher.
     */
    UrlMatcherFactory.prototype.compile = function (pattern, config) {
        return new UrlMatcher(pattern, this.paramTypes, this.paramFactory, this._getConfig(config));
    };
    /**
     * Returns true if the specified object is a [[UrlMatcher]], or false otherwise.
     *
     * @param object  The object to perform the type check against.
     * @returns `true` if the object matches the `UrlMatcher` interface, by
     *          implementing all the same methods.
     */
    UrlMatcherFactory.prototype.isMatcher = function (object) {
        // TODO: typeof?
        if (!isObject(object))
            return false;
        var result = true;
        forEach(UrlMatcher.prototype, function (val, name) {
            if (isFunction(val))
                result = result && (isDefined(object[name]) && isFunction(object[name]));
        });
        return result;
    };
    /**
     * Creates and registers a custom [[ParamType]] object
     *
     * A [[ParamType]] can be used to generate URLs with typed parameters.
     *
     * @param name  The type name.
     * @param definition The type definition. See [[ParamTypeDefinition]] for information on the values accepted.
     * @param definitionFn A function that is injected before the app runtime starts.
     *        The result of this function should be a [[ParamTypeDefinition]].
     *        The result is merged into the existing `definition`.
     *        See [[ParamType]] for information on the values accepted.
     *
     * @returns - if a type was registered: the [[UrlMatcherFactory]]
     *   - if only the `name` parameter was specified: the currently registered [[ParamType]] object, or undefined
     *
     * Note: Register custom types *before using them* in a state definition.
     *
     * See [[ParamTypeDefinition]] for examples
     */
    UrlMatcherFactory.prototype.type = function (name, definition, definitionFn) {
        var type = this.paramTypes.type(name, definition, definitionFn);
        return !isDefined(definition) ? type : this;
    };
    /** @hidden */
    UrlMatcherFactory.prototype.$get = function () {
        this.paramTypes.enqueue = false;
        this.paramTypes._flushTypeQueue();
        return this;
    };
    /** @internalapi */
    UrlMatcherFactory.prototype.dispose = function () {
        this.paramTypes.dispose();
    };
    return UrlMatcherFactory;
}());
export { UrlMatcherFactory };
//# sourceMappingURL=urlMatcherFactory.js.map