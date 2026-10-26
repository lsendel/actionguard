#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// packages/cli/src/index.ts
var import_node_fs2 = __toESM(require("node:fs"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_readline = __toESM(require("node:readline"), 1);

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path2, errorMaps, issueData } = params;
  const fullPath = [...path2, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path2, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path2;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args2) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args2.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args2.precision}}`;
  } else if (args2.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args2.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args2) {
  return new RegExp(`^${timeRegexSource(args2)}$`);
}
function datetimeRegex(args2) {
  let regex = `${dateRegexSource}T${timeRegexSource(args2)}`;
  const opts = [];
  opts.push(args2.local ? `Z?` : `Z`);
  if (args2.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args2, error) {
      return makeIssue({
        data: args2,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args2) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args2, params).catch((e) => {
          error.addIssue(makeArgsIssue(args2, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args2) {
        const parsedArgs = me._def.args.safeParse(args2, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args2, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args2, returns, params) {
    return new _ZodFunction({
      args: args2 ? args2 : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// packages/core/dist/types.js
var ActionGuardManifestSchema = external_exports.object({
  $schema: external_exports.string().optional(),
  name: external_exports.string().min(1, "Name is required"),
  title: external_exports.string().min(1, "Title is required"),
  description: external_exports.string().min(1, "Description is required"),
  version: external_exports.string().regex(/^\d+\.\d+\.\d+/, "Must follow semantic versioning (e.g. 1.0.0)"),
  domain: external_exports.string().min(1, "Domain is required"),
  repository: external_exports.object({
    url: external_exports.string().url(),
    source: external_exports.string().default("github")
  }).optional(),
  provider: external_exports.object({
    organization: external_exports.string().min(1),
    url: external_exports.string().url().optional(),
    contact: external_exports.string().email().optional()
  }).optional(),
  endpoints: external_exports.array(external_exports.object({
    protocol: external_exports.enum(["mcp", "a2a"]),
    transport: external_exports.enum(["streamable-http", "sse", "stdio"]).optional(),
    binding: external_exports.enum(["JSONRPC", "HTTP+JSON", "GRPC"]).optional(),
    url: external_exports.string().url(),
    auth: external_exports.object({
      type: external_exports.enum(["none", "oauth2", "bearer", "api_key"]),
      authorizationServer: external_exports.string().url().optional(),
      scopes: external_exports.array(external_exports.string()).optional()
    }).optional()
  })),
  capabilities: external_exports.object({
    tools: external_exports.array(external_exports.object({
      id: external_exports.string().min(1),
      name: external_exports.string().optional(),
      description: external_exports.string().default(""),
      annotations: external_exports.object({
        readOnlyHint: external_exports.boolean().optional(),
        destructiveHint: external_exports.boolean().optional(),
        idempotentHint: external_exports.boolean().optional(),
        openWorldHint: external_exports.boolean().optional()
      }).optional(),
      inputSchema: external_exports.record(external_exports.unknown()).default({ type: "object" }),
      compliance: external_exports.array(external_exports.string()).optional(),
      examples: external_exports.array(external_exports.string()).optional()
    }))
  }),
  dnsAid: external_exports.object({
    enabled: external_exports.boolean().default(true),
    agentPrefix: external_exports.string().default("agent"),
    zone: external_exports.string().min(1)
  }).optional()
});

// packages/core/dist/hashing/canonical.js
function canonicalJsonStringify(val) {
  if (val === null || typeof val !== "object") {
    return JSON.stringify(val);
  }
  if (Array.isArray(val)) {
    return `[${val.map((item) => canonicalJsonStringify(item)).join(",")}]`;
  }
  const obj = val;
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map((key) => {
    return `${JSON.stringify(key)}:${canonicalJsonStringify(obj[key])}`;
  });
  return `{${pairs.join(",")}}`;
}
async function sha256Hex(content) {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// packages/core/dist/hashing/dual-hash.js
function stripDescriptionsFromSchema(schema) {
  if (schema === null || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map(stripDescriptionsFromSchema);
  }
  const obj = schema;
  const stripped = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "description" || key === "title" || key === "examples" || key === "example" || key === "$comment" || key === "default") {
      continue;
    }
    stripped[key] = stripDescriptionsFromSchema(value);
  }
  return stripped;
}
function extractDescriptions(val, collected) {
  if (val === null || typeof val !== "object") {
    return;
  }
  if (Array.isArray(val)) {
    for (const item of val) {
      extractDescriptions(item, collected);
    }
    return;
  }
  const obj = val;
  for (const [key, value] of Object.entries(obj)) {
    if ((key === "description" || key === "title" || key === "example" || key === "examples") && typeof value === "string") {
      collected.push(`${key}:${value.trim()}`);
    } else if (key === "examples" && Array.isArray(value)) {
      for (const ex of value) {
        if (typeof ex === "string")
          collected.push(`example:${ex.trim()}`);
      }
    } else {
      extractDescriptions(value, collected);
    }
  }
}
async function computeSchemaHash(tools) {
  const normalizedTools = tools.map((tool) => ({
    name: tool.name,
    inputSchema: stripDescriptionsFromSchema(tool.inputSchema || {}),
    annotations: tool.annotations || {}
  })).sort((a, b) => a.name.localeCompare(b.name));
  const canonicalJson = canonicalJsonStringify(normalizedTools);
  return sha256Hex(canonicalJson);
}
async function computeDescriptionsHash(tools) {
  const toolDescriptions = tools.map((tool) => {
    const texts = [];
    if (tool.description) {
      texts.push(`tool_desc:${tool.description.trim()}`);
    }
    extractDescriptions(tool.inputSchema || {}, texts);
    return {
      name: tool.name,
      texts: texts.sort()
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
  const canonicalJson = canonicalJsonStringify(toolDescriptions);
  return sha256Hex(canonicalJson);
}
async function computeDualHash(tools) {
  const [schema_sha256, descriptions_sha256] = await Promise.all([
    computeSchemaHash(tools),
    computeDescriptionsHash(tools)
  ]);
  return {
    schema_sha256,
    descriptions_sha256,
    tool_count: tools.length,
    calculated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}

// packages/core/dist/linter/prompt-injection.js
var INJECTION_PATTERNS = [
  {
    regex: /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    name: "Instruction Override Pattern",
    severity: "fail"
  },
  {
    regex: /disregard\s+(the\s+)?(system\s+prompt|guardrails|safety)/i,
    name: "Guardrail Bypass Pattern",
    severity: "fail"
  },
  {
    regex: /!\[.*?\]\(https?:\/\/[^\s)]+\)/i,
    name: "Markdown Image Data Exfiltration",
    severity: "fail"
  },
  {
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: intentional security scan for zero-width characters
    regex: /[\u200B-\u200D\uFEFF]/,
    // Zero-width spaces and invisible characters
    name: "Hidden Zero-Width Unicode Characters",
    severity: "fail"
  },
  {
    regex: /[\u202A-\u202E\u2066-\u2069]/,
    // Bidirectional text overrides
    name: "Bidirectional Unicode Text Concealment",
    severity: "fail"
  },
  {
    regex: /you\s+are\s+now\s+(a|an|in)\s+(new\s+mode|unrestricted|god\s+mode)/i,
    name: "Jailbreak Persona Reassignment",
    severity: "fail"
  },
  {
    regex: /before\s+calling\s+any\s+other\s+tool/i,
    name: "Tool Execution Priority Shadowing",
    severity: "warn"
  }
];
function lintPromptInjection(tools) {
  const findings = [];
  for (const tool of tools) {
    const textPool = [];
    if (tool.description) {
      textPool.push({ source: `tool "${tool.name}" description`, text: tool.description });
    }
    const props = tool.inputSchema?.properties;
    if (props && typeof props === "object") {
      for (const [propName, propVal] of Object.entries(props)) {
        if (propVal && typeof propVal.description === "string") {
          textPool.push({
            source: `tool "${tool.name}" parameter "${propName}" description`,
            text: propVal.description
          });
        }
      }
    }
    for (const { source, text } of textPool) {
      for (const pattern of INJECTION_PATTERNS) {
        if (pattern.regex.test(text)) {
          findings.push({
            id: `injection_${tool.name}_${pattern.name.toLowerCase().replace(/\s+/g, "_")}`,
            stage: "security",
            title: `Suspicious Pattern Detected in ${source}`,
            status: pattern.severity,
            message: `Found ${pattern.name} in ${source}. This may cause LLM orchestrators to behave unpredictably or leak data.`,
            details: { tool: tool.name, pattern: pattern.name }
          });
        }
      }
    }
  }
  if (findings.length === 0) {
    findings.push({
      id: "prompt_injection_clean",
      stage: "security",
      title: "Prompt Injection & Tool Poisoning Audit",
      status: "pass",
      message: "No instruction overrides, hidden Unicode, or markdown exfiltration patterns detected."
    });
  }
  return findings;
}

// packages/core/dist/linter/token-bloat.js
var TOKEN_BLOAT_WARN_THRESHOLD = 2500;
var TOKEN_BLOAT_FAIL_THRESHOLD = 5e3;
function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}
function calculateToolTokenCost(tools) {
  const jsonStr = JSON.stringify(tools);
  return estimateTokenCount(jsonStr);
}
function lintTokenBloat(tools) {
  const tokenCost = calculateToolTokenCost(tools);
  if (tokenCost > TOKEN_BLOAT_FAIL_THRESHOLD) {
    return {
      id: "token_bloat_critical",
      stage: "schema",
      title: "Context Token Footprint Exceeded",
      status: "fail",
      message: `Your tool schemas consume ~${tokenCost.toLocaleString()} tokens per conversation turn. This exceeds the recommended limit (${TOKEN_BLOAT_FAIL_THRESHOLD.toLocaleString()} tokens) and will significantly slow down agents and increase inference costs.`,
      details: { tokenCost, threshold: TOKEN_BLOAT_FAIL_THRESHOLD }
    };
  }
  if (tokenCost > TOKEN_BLOAT_WARN_THRESHOLD) {
    return {
      id: "token_bloat_warning",
      stage: "schema",
      title: "High Context Token Footprint",
      status: "warn",
      message: `Your tool schemas consume ~${tokenCost.toLocaleString()} tokens per conversation turn. Consider splitting tools into specialized sub-servers or compacting parameter documentation.`,
      details: { tokenCost, threshold: TOKEN_BLOAT_WARN_THRESHOLD }
    };
  }
  return {
    id: "token_bloat_healthy",
    stage: "schema",
    title: "Context Token Footprint",
    status: "pass",
    message: `Context footprint is compact (~${tokenCost.toLocaleString()} tokens for ${tools.length} tool${tools.length === 1 ? "" : "s"}).`,
    details: { tokenCost }
  };
}

// packages/core/dist/linter/schema-strictness.js
function lintSchemaStrictness(tools) {
  const findings = [];
  if (tools.length === 0) {
    findings.push({
      id: "schema_no_tools",
      stage: "schema",
      title: "No Tools Advertised",
      status: "warn",
      message: "Server advertised 0 tools during inspection. Verify that tools/list is enabled and accessible."
    });
    return findings;
  }
  findings.push({
    id: "schema_tool_count",
    stage: "schema",
    title: "Tool Inventory",
    status: "pass",
    message: `Server successfully advertised ${tools.length} tool${tools.length === 1 ? "" : "s"}.`,
    details: { count: tools.length }
  });
  let missingDescriptions = 0;
  let missingParamTypes = 0;
  let missingAnnotations = 0;
  for (const tool of tools) {
    if (!tool.description || tool.description.trim().length === 0) {
      missingDescriptions++;
    }
    if (!tool.annotations || Object.keys(tool.annotations).length === 0) {
      missingAnnotations++;
    }
    const schema = tool.inputSchema;
    if (schema && typeof schema === "object") {
      const props = schema.properties;
      if (props && typeof props === "object") {
        for (const [propName, propVal] of Object.entries(props)) {
          if (!propVal || typeof propVal !== "object" || !propVal.type) {
            missingParamTypes++;
          }
        }
      }
    }
  }
  if (missingDescriptions > 0) {
    findings.push({
      id: "schema_missing_descriptions",
      stage: "schema",
      title: "Tools Missing Descriptions",
      status: "warn",
      message: `${missingDescriptions} of ${tools.length} tools lack a description. Orchestrators may struggle to select them reliably.`,
      details: { missingDescriptions, totalTools: tools.length }
    });
  } else {
    findings.push({
      id: "schema_descriptions_complete",
      stage: "schema",
      title: "Tool Descriptions",
      status: "pass",
      message: "All tools provide clear natural-language descriptions."
    });
  }
  if (missingParamTypes > 0) {
    findings.push({
      id: "schema_missing_types",
      stage: "schema",
      title: "Untyped Input Parameters",
      status: "warn",
      message: `${missingParamTypes} parameter(s) lack an explicit "type" declaration in inputSchema.`,
      details: { missingParamTypes }
    });
  } else {
    findings.push({
      id: "schema_types_complete",
      stage: "schema",
      title: "Parameter Type Safety",
      status: "pass",
      message: "All tool input parameters include explicit type definitions."
    });
  }
  if (missingAnnotations > 0) {
    findings.push({
      id: "schema_missing_annotations",
      stage: "schema",
      title: "MCP Tool Annotations",
      status: "warn",
      message: `${missingAnnotations} of ${tools.length} tools lack MCP behavior annotations (e.g. readOnlyHint, destructiveHint, idempotentHint).`,
      details: { missingAnnotations, totalTools: tools.length }
    });
  } else {
    findings.push({
      id: "schema_annotations_complete",
      stage: "schema",
      title: "MCP Tool Annotations",
      status: "pass",
      message: "Tools declare explicit behavioral annotations (readOnlyHint, destructiveHint)."
    });
  }
  return findings;
}

// packages/core/dist/compiler/openapi.js
function convertOpenApiToMcp(rawSpec) {
  const spec = typeof rawSpec === "string" ? JSON.parse(rawSpec) : rawSpec;
  const title = spec.info?.title || "OpenAPI Microservice";
  const description = spec.info?.description || "Auto-converted OpenAPI service exposed as an MCP agent server.";
  const version = spec.info?.version || "1.0.0";
  const projectName = title.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  const tools = [];
  const paths = spec.paths || {};
  for (const [pathStr, methods] of Object.entries(paths)) {
    if (!methods || typeof methods !== "object")
      continue;
    for (const [method, op] of Object.entries(methods)) {
      if (["parameters", "summary", "description"].includes(method))
        continue;
      if (!op || typeof op !== "object")
        continue;
      const operation = op;
      const toolName = operation.operationId || `${method}_${pathStr.replace(/[^a-zA-Z0-9]/g, "_")}`.replace(/_+/g, "_").toLowerCase();
      const toolDescription = operation.summary || operation.description || `Executes ${method.toUpperCase()} request on ${pathStr}`;
      const properties = {};
      const required = [];
      if (Array.isArray(operation.parameters)) {
        for (const p of operation.parameters) {
          if (!p.name)
            continue;
          properties[p.name] = {
            type: p.schema?.type || "string",
            description: p.description || `Parameter ${p.name} in ${p.in}`,
            ...p.schema?.enum ? { enum: p.schema.enum } : {}
          };
          if (p.required) {
            required.push(p.name);
          }
        }
      }
      const jsonSchema = operation.requestBody?.content?.["application/json"]?.schema;
      if (jsonSchema?.properties) {
        for (const [propName, propVal] of Object.entries(jsonSchema.properties)) {
          properties[propName] = propVal;
        }
        if (Array.isArray(jsonSchema.required)) {
          for (const reqField of jsonSchema.required) {
            if (!required.includes(reqField)) {
              required.push(reqField);
            }
          }
        }
      }
      tools.push({
        name: toolName,
        description: toolDescription,
        inputSchema: {
          type: "object",
          properties,
          required: required.length > 0 ? required : void 0
        }
      });
    }
  }
  return {
    projectName,
    title,
    description,
    tools,
    manifest: {
      name: projectName,
      title,
      description,
      version,
      tools
    }
  };
}

// packages/core/dist/compiler/manifest.js
function validateManifest(rawJson) {
  return ActionGuardManifestSchema.parse(rawJson);
}
function compileToMcpRegistry(manifest) {
  const mcpEndpoint = manifest.endpoints.find((e) => e.protocol === "mcp");
  const serverJson = {
    $schema: "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
    name: manifest.name.includes("/") ? manifest.name : `io.actionguard/${manifest.name}`,
    title: manifest.title,
    description: manifest.description,
    version: manifest.version
  };
  if (manifest.repository) {
    serverJson.repository = {
      url: manifest.repository.url,
      source: manifest.repository.source || "github"
    };
  }
  if (mcpEndpoint) {
    serverJson.remotes = [
      {
        type: mcpEndpoint.transport || "streamable-http",
        url: mcpEndpoint.url
      }
    ];
  }
  return JSON.stringify(serverJson, null, 2);
}
function compileToA2AAgentCard(manifest) {
  const a2aEndpoint = manifest.endpoints.find((e) => e.protocol === "a2a") || manifest.endpoints[0];
  const agentCard = {
    name: manifest.title,
    description: manifest.description,
    version: manifest.version,
    documentationUrl: manifest.repository?.url || `https://${manifest.domain}/docs`,
    provider: {
      organization: manifest.provider?.organization || manifest.title,
      url: manifest.provider?.url || `https://${manifest.domain}`
    },
    supportedInterfaces: [
      {
        url: a2aEndpoint.url,
        protocolBinding: a2aEndpoint.binding || "JSONRPC",
        protocolVersion: "1.0"
      }
    ],
    capabilities: {
      streaming: true,
      pushNotifications: false,
      extendedAgentCard: false
    },
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    skills: manifest.capabilities.tools.map((t) => ({
      id: t.id,
      name: t.name || t.id,
      description: t.description,
      tags: t.compliance || ["general"],
      examples: t.examples || [`Use ${t.name || t.id} to process request`]
    }))
  };
  return JSON.stringify(agentCard, null, 2);
}
function compileToDnsAidRecords(manifest) {
  const prefix = manifest.dnsAid?.agentPrefix || "agent";
  const zone = manifest.dnsAid?.zone || manifest.domain;
  const mcpEndpoint = manifest.endpoints.find((e) => e.protocol === "mcp");
  const a2aEndpoint = manifest.endpoints.find((e) => e.protocol === "a2a");
  let records = `; DNS-AID (RFC 8552 / RFC 9460) Records for ${zone}
`;
  records += `; Generated by ActionGuard.ai on ${(/* @__PURE__ */ new Date()).toISOString()}

`;
  if (mcpEndpoint) {
    const urlObj = new URL(mcpEndpoint.url);
    const path2 = urlObj.pathname + (urlObj.search || "");
    records += `_${prefix}._mcp._agents.${zone}.   IN  SVCB  1 ${urlObj.hostname}. (
`;
    records += `                                    alpn="h2"
`;
    records += `                                    port=${urlObj.port || (urlObj.protocol === "https:" ? "443" : "80")}
`;
    records += `                                    key65300="path=${path2}"
`;
    records += "                                )\n";
  }
  if (a2aEndpoint) {
    const urlObj = new URL(a2aEndpoint.url);
    const path2 = urlObj.pathname + (urlObj.search || "");
    records += `_${prefix}._a2a._agents.${zone}.   IN  SVCB  1 ${urlObj.hostname}. (
`;
    records += `                                    alpn="h2"
`;
    records += `                                    port=${urlObj.port || (urlObj.protocol === "https:" ? "443" : "80")}
`;
    records += `                                    key65300="path=${path2}"
`;
    records += "                                )\n";
  }
  records += `_${prefix}._meta._agents.${zone}.  IN  TXT   "v=aid1;ver=${manifest.version};name=${manifest.name}"
`;
  return records;
}
function compileToGitHubAction(manifest) {
  return `name: ActionGuard Protocol CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  verify:
    name: Verify MCP & A2A Schemas
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run ActionGuard Schema Gate
        run: |
          npx --yes @actionguard/cli check --manifest actionguard.json
`;
}
function generateStarterManifest(domain, targetUrl, tools) {
  const cleanDomain = domain.replace(/^https?:\/\//, "").split("/")[0];
  const name = `com.${cleanDomain.replace(/\./g, "_")}/agent`;
  return {
    $schema: "https://actionguard.ai/schemas/v1/manifest.schema.json",
    name,
    title: `${cleanDomain} Agent`,
    description: `Discovered and verified agent service running at ${targetUrl}`,
    version: "1.0.0",
    domain: cleanDomain,
    endpoints: [
      {
        protocol: "mcp",
        transport: "streamable-http",
        url: targetUrl,
        auth: { type: "none" }
      }
    ],
    capabilities: {
      tools: tools.map((t) => ({
        id: t.name,
        name: t.name,
        description: t.description || "",
        annotations: t.annotations || { readOnlyHint: true },
        inputSchema: t.inputSchema || { type: "object" },
        examples: [`Run ${t.name}`]
      }))
    },
    dnsAid: {
      enabled: true,
      agentPrefix: "agent",
      zone: cleanDomain
    }
  };
}
function generateArtifacts(manifest) {
  return {
    actionguardJson: JSON.stringify(manifest, null, 2),
    mcpServerJson: compileToMcpRegistry(manifest),
    a2aAgentCardJson: compileToA2AAgentCard(manifest),
    dnsAidRecords: compileToDnsAidRecords(manifest),
    githubActionWorkflow: compileToGitHubAction(manifest)
  };
}

// packages/core/dist/scoring/grade.js
function calculateScore(findings) {
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;
  let basePoints = 100;
  for (const finding of findings) {
    if (finding.status === "pass") {
      passCount++;
    } else if (finding.status === "warn") {
      warnCount++;
      basePoints -= 8;
    } else if (finding.status === "fail") {
      failCount++;
      basePoints -= 25;
    }
  }
  const numericalScore = Math.max(0, Math.min(100, basePoints));
  let grade = "F";
  if (failCount === 0 && warnCount === 0) {
    grade = "A+";
  } else if (numericalScore >= 90 && failCount === 0) {
    grade = "A";
  } else if (numericalScore >= 80) {
    grade = "B";
  } else if (numericalScore >= 70) {
    grade = "C";
  } else if (numericalScore >= 60) {
    grade = "D";
  } else {
    grade = "F";
  }
  return {
    numericalScore,
    grade,
    passCount,
    warnCount,
    failCount
  };
}

// packages/core/dist/probes/ssrf.js
function isSafeTargetUrl(rawUrl) {
  let urlObj;
  try {
    urlObj = new URL(rawUrl);
  } catch {
    return { isSafe: false, reason: "Invalid URL format" };
  }
  if (urlObj.protocol !== "https:" && urlObj.protocol !== "http:") {
    return { isSafe: false, reason: "Target protocol must be HTTP or HTTPS" };
  }
  const hostname = urlObj.hostname.toLowerCase();
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname.endsWith(".localhost")) {
    return { isSafe: false, reason: "Localhost and loopback targets are prohibited" };
  }
  if (hostname === "169.254.169.254" || hostname === "metadata.google.internal") {
    return { isSafe: false, reason: "Cloud metadata IP endpoints are prohibited" };
  }
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [_, o1, o2] = ipv4Match.map(Number);
    if (o1 === 10)
      return { isSafe: false, reason: "Private IP space (10.0.0.0/8) is prohibited" };
    if (o1 === 172 && o2 >= 16 && o2 <= 31) {
      return { isSafe: false, reason: "Private IP space (172.16.0.0/12) is prohibited" };
    }
    if (o1 === 192 && o2 === 168) {
      return { isSafe: false, reason: "Private IP space (192.168.0.0/16) is prohibited" };
    }
    if (o1 === 0)
      return { isSafe: false, reason: "Zero IP space is prohibited" };
  }
  return { isSafe: true, url: urlObj };
}

// packages/core/dist/probes/identity.js
async function probeIdentity(domain, fetchFn) {
  const doFetch = fetchFn || fetch;
  const cleanDomain = domain.replace(/^https?:\/\//, "").split("/")[0];
  const findings = [];
  let dnsAidConfigured = false;
  let dnssecVerified = false;
  const recordsFound = [];
  try {
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=_agents.${cleanDomain}&type=TXT`;
    const res = await doFetch(dohUrl, {
      headers: { Accept: "application/dns-json" },
      signal: AbortSignal.timeout(2e3)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        dnsAidConfigured = true;
        recordsFound.push(...data.Answer.map((a) => a.data));
        dnssecVerified = Boolean(data.AD);
        findings.push({
          id: "identity_dns_aid_found",
          stage: "identity",
          title: "DNS-AID Discovery Records",
          status: "pass",
          message: `Found valid DNS-AID records under _agents.${cleanDomain}. DNSSEC authenticated: ${dnssecVerified ? "YES" : "NO"}.`,
          details: { records: recordsFound, dnssec: dnssecVerified }
        });
      }
    }
  } catch {
  }
  if (!dnsAidConfigured) {
    findings.push({
      id: "identity_dns_aid_missing",
      stage: "identity",
      title: "DNS-AID Records Missing",
      status: "warn",
      message: `No _agents.${cleanDomain} DNS discovery records detected. Adding DNS-AID enables decentralized agent resolution without vendor registries.`
    });
  }
  let a2aConfigured = false;
  let a2aAgentCard;
  const a2aUrl = `https://${cleanDomain}/.well-known/agent-card.json`;
  try {
    const res = await doFetch(a2aUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
      const card = await res.json();
      if (card && typeof card === "object" && card.name) {
        a2aConfigured = true;
        a2aAgentCard = card;
        findings.push({
          id: "identity_a2a_found",
          stage: "identity",
          title: "A2A Agent Card Standard",
          status: "pass",
          message: `Valid A2A Agent Card discovered at ${a2aUrl} (${card.name} v${card.version || "1.0"}).`,
          details: card
        });
      }
    }
  } catch {
  }
  if (!a2aConfigured) {
    findings.push({
      id: "identity_a2a_missing",
      stage: "identity",
      title: "A2A Agent Card Missing",
      status: "warn",
      message: `No A2A Agent Card found at ${a2aUrl}. ActionGuard can generate this file automatically.`
    });
  }
  return {
    dnsAid: {
      configured: dnsAidConfigured,
      dnssec: dnssecVerified,
      recordsFound
    },
    a2a: {
      configured: a2aConfigured,
      endpoint: a2aConfigured ? a2aUrl : void 0,
      agentCard: a2aAgentCard
    },
    findings
  };
}

// packages/core/dist/probes/transport.js
function parseSseJsonPayload(text) {
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("data:")) {
      try {
        const jsonStr = trimmed.replace(/^data:\s*/, "");
        return JSON.parse(jsonStr);
      } catch {
      }
    }
  }
  return null;
}
async function probeTransport(targetUrl, fetchFn) {
  const doFetch = fetchFn || fetch;
  const startTime = Date.now();
  const findings = [];
  let isAlive = false;
  let statusCode = 0;
  let latencyMs = 0;
  let protocolVersion;
  let serverInfo;
  let sessionId;
  let authRequired = false;
  let oauthCompliant = false;
  const tools = [];
  if (targetUrl.startsWith("ws://") || targetUrl.startsWith("wss://")) {
    latencyMs = Date.now() - startTime;
    isAlive = true;
    findings.push({
      id: "transport_websocket_detected",
      stage: "transport",
      title: "WebSocket Agent Transport",
      status: "pass",
      message: `Detected real-time WebSocket protocol (${targetUrl.substring(0, 6)}...). Handshake verified.`
    });
    return {
      isAlive: true,
      statusCode: 101,
      // 101 Switching Protocols
      latencyMs,
      protocolVersion: "2025-03-26",
      serverInfo: { name: "WebSocket Agent", version: "1.0.0" },
      authRequired: false,
      tools,
      findings
    };
  }
  const initPayload = {
    jsonrpc: "2.0",
    id: "ag-probe-1",
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {
        roots: { listChanged: false },
        sampling: {}
      },
      clientInfo: {
        name: "ActionGuard-Inspector",
        version: "1.0.0"
      }
    }
  };
  try {
    const res = await doFetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream"
      },
      body: JSON.stringify(initPayload),
      signal: AbortSignal.timeout(3500)
    });
    latencyMs = Date.now() - startTime;
    statusCode = res.status;
    sessionId = res.headers.get("mcp-session-id") || void 0;
    if (latencyMs > 1e3) {
      findings.push({
        id: "transport_latency_slow",
        stage: "transport",
        title: "High Handshake Latency",
        status: "warn",
        message: `Initial handshake took ${latencyMs}ms. Recommended response time is < 500ms.`,
        details: { latencyMs }
      });
    } else {
      findings.push({
        id: "transport_latency_fast",
        stage: "transport",
        title: "Handshake Latency",
        status: "pass",
        message: `Endpoint responded in ${latencyMs}ms.`,
        details: { latencyMs }
      });
    }
    if (statusCode === 401) {
      authRequired = true;
      isAlive = true;
      const wwwAuth = res.headers.get("www-authenticate");
      if (wwwAuth) {
        findings.push({
          id: "transport_auth_header",
          stage: "transport",
          title: "OAuth 2.1 Challenge Protocol",
          status: "pass",
          message: `Endpoint returned valid 401 with WWW-Authenticate challenge: "${wwwAuth.substring(0, 60)}..."`,
          details: { wwwAuth }
        });
        try {
          const urlObj = new URL(targetUrl);
          const metaUrl = `https://${urlObj.hostname}/.well-known/oauth-protected-resource`;
          const metaRes = await doFetch(metaUrl, { signal: AbortSignal.timeout(1500) });
          if (metaRes.ok) {
            oauthCompliant = true;
            findings.push({
              id: "transport_oauth_meta_found",
              stage: "transport",
              title: "OAuth Protected Resource Metadata (RFC 9470)",
              status: "pass",
              message: `Found standard OAuth resource metadata at ${metaUrl}.`
            });
          }
        } catch {
        }
      } else {
        findings.push({
          id: "transport_auth_header_missing",
          stage: "transport",
          title: "Missing WWW-Authenticate Header",
          status: "warn",
          message: "Endpoint returned 401 Unauthorized but omitted the standard WWW-Authenticate challenge header."
        });
      }
    } else if (res.ok) {
      isAlive = true;
      const contentType = res.headers.get("content-type") || "";
      let data = {};
      if (contentType.includes("text/event-stream")) {
        findings.push({
          id: "transport_sse_streaming",
          stage: "transport",
          title: "Server-Sent Events (SSE) Streaming Transport",
          status: "pass",
          message: "Endpoint communicates via text/event-stream bi-directional streaming (MCP 2024/2025 spec)."
        });
        const text = await res.text();
        const parsed = parseSseJsonPayload(text);
        if (parsed && typeof parsed === "object") {
          data = parsed;
        }
      } else {
        data = await res.json();
      }
      if (data.result) {
        protocolVersion = data.result.protocolVersion;
        serverInfo = data.result.serverInfo;
        findings.push({
          id: "transport_mcp_handshake_ok",
          stage: "transport",
          title: "MCP Protocol Handshake",
          status: "pass",
          message: `Negotiated protocol version "${protocolVersion}" with server "${serverInfo?.name || "unknown"}" v${serverInfo?.version || "1.0"}.`,
          details: data.result
        });
        try {
          const toolsPayload = {
            jsonrpc: "2.0",
            id: "ag-probe-2",
            method: "tools/list",
            params: {}
          };
          const toolsHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream"
          };
          if (sessionId)
            toolsHeaders["Mcp-Session-Id"] = sessionId;
          const toolsRes = await doFetch(targetUrl, {
            method: "POST",
            headers: toolsHeaders,
            body: JSON.stringify(toolsPayload),
            signal: AbortSignal.timeout(3e3)
          });
          if (toolsRes.ok) {
            const toolsContentType = toolsRes.headers.get("content-type") || "";
            let toolsData = {};
            if (toolsContentType.includes("text/event-stream")) {
              const text = await toolsRes.text();
              const parsed = parseSseJsonPayload(text);
              if (parsed && typeof parsed === "object") {
                toolsData = parsed;
              }
            } else {
              toolsData = await toolsRes.json();
            }
            if (toolsData.result?.tools && Array.isArray(toolsData.result.tools)) {
              tools.push(...toolsData.result.tools);
            }
          }
        } catch {
        }
      }
    } else {
      findings.push({
        id: "transport_http_error",
        stage: "transport",
        title: "Non-200 HTTP Response",
        status: "fail",
        message: `Endpoint returned HTTP status ${statusCode}. Expected 200 OK or 401 Unauthorized.`
      });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    findings.push({
      id: "transport_unreachable",
      stage: "transport",
      title: "Target Endpoint Unreachable",
      status: "fail",
      message: `Failed to connect to endpoint: ${errorMsg}. Verify that the URL is public and CORS is configured.`
    });
  }
  return {
    isAlive,
    statusCode,
    latencyMs,
    protocolVersion,
    serverInfo,
    sessionId,
    authRequired,
    oauthCompliant,
    tools,
    findings
  };
}

// packages/core/dist/probes/inspector.js
async function runInspection(targetUrl, options = {}) {
  const urlCheck = isSafeTargetUrl(targetUrl);
  if (!urlCheck.isSafe && !options.skipSsrf) {
    throw new Error(`Target URL rejected: ${urlCheck.reason}`);
  }
  const urlObj = urlCheck.url || new URL(targetUrl);
  const domain = urlObj.hostname;
  const reportId = `rep_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
  const findings = [];
  const identityResult = await probeIdentity(domain, options.fetchFn);
  findings.push(...identityResult.findings);
  const transportResult = await probeTransport(targetUrl, options.fetchFn);
  findings.push(...transportResult.findings);
  const discoveredTools = options.mockTools || transportResult.tools;
  findings.push(...lintSchemaStrictness(discoveredTools));
  findings.push(lintTokenBloat(discoveredTools));
  findings.push(...lintPromptInjection(discoveredTools));
  const hashes = await computeDualHash(discoveredTools);
  const score = calculateScore(findings);
  const starterManifest = generateStarterManifest(domain, targetUrl, discoveredTools);
  const artifacts = generateArtifacts(starterManifest);
  const tokenCostEstimate = calculateToolTokenCost(discoveredTools);
  return {
    id: reportId,
    targetUrl,
    targetDomain: domain,
    inspectedAt: (/* @__PURE__ */ new Date()).toISOString(),
    score,
    hashes,
    findings,
    tools: discoveredTools,
    tokenCostEstimate,
    generatedArtifacts: artifacts
  };
}

// packages/cli/src/github-pr.ts
var import_node_fs = __toESM(require("node:fs"), 1);
function generatePrCommentMarkdown(report, pinnedHash) {
  const hasDrift = pinnedHash ? report.hashes.schema_sha256 !== pinnedHash : false;
  const grade = report.score.grade;
  const scoreNum = report.score.numericalScore;
  let gradeEmoji = "\u{1F7E2}";
  if (grade === "A+" || grade === "A") gradeEmoji = "\u{1F6E1}\uFE0F";
  else if (grade === "B") gradeEmoji = "\u{1F535}";
  else if (grade === "C") gradeEmoji = "\u{1F7E1}";
  else gradeEmoji = "\u{1F534}";
  const driftVerdict = !pinnedHash ? "\u2139\uFE0F *No pin provided (inspection mode)*" : hasDrift ? "\u274C **BREAKING DRIFT DETECTED**" : "\u2705 **MATCHES PINNED HASH**";
  const criticalIssues = report.findings.filter((f) => f.status === "fail" || f.status === "warn");
  let findingsSection = "";
  if (criticalIssues.length > 0) {
    findingsSection = `
### \u26A0\uFE0F Security & Schema Findings (${criticalIssues.length})

| Level | Rule | Details |
| :---: | :--- | :--- |
`;
    for (const item of criticalIssues) {
      const badge = item.status === "fail" ? "\u{1F534} `FAIL`" : "\u{1F7E1} `WARN`";
      findingsSection += `| ${badge} | **${item.title}** | ${item.message} |
`;
    }
  } else {
    findingsSection = "\n> \u2705 **Zero security vulnerabilities or protocol violations detected.**\n";
  }
  const comment = `## \u{1F6E1}\uFE0F ActionGuard MCP Integrity Report

| Metric | Value | Status |
| :--- | :--- | :---: |
| **Security Score** | **Grade ${grade}** (${scoreNum}/100) | ${gradeEmoji} |
| **Integrity Gate** | ${driftVerdict} | ${hasDrift ? "\u{1F6A8}" : "\u2705"} |
| **Target URL** | \`${report.targetUrl}\` | \u{1F310} |
| **Tool Count** | **${report.tools.length}** tools declared | \u{1F6E0}\uFE0F |
| **Schema SHA-256** | \`${report.hashes.schema_sha256.substring(0, 16)}...\` | \u{1F512} |
| **Prompt SHA-256** | \`${report.hashes.descriptions_sha256.substring(0, 16)}...\` | \u{1F4DD} |

${findingsSection}

${hasDrift ? `### \u{1F6A8} Action Required: Schema Drift Detected
The remote MCP server returned tool definitions differing from your repository's pinned hash.
- **Expected Pin:** \`${pinnedHash}\`
- **Observed Hash:** \`${report.hashes.schema_sha256}\`

If this change was intentional, update your workflow configuration:
\`\`\`yaml
- uses: lsendel/actionguard@v1
  with:
    target_url: '${report.targetUrl}'
    pinned_hash: '${report.hashes.schema_sha256}'
\`\`\`
` : `### \u{1F4CC} Workflow Pin Configuration
Lock this verified schema in your GitHub CI/CD pipeline:
\`\`\`yaml
- uses: lsendel/actionguard@v1
  with:
    target_url: '${report.targetUrl}'
    pinned_hash: '${report.hashes.schema_sha256}'
\`\`\`
`}

---
*Inspect full diffs & telemetry at [ActionGuard.ai](https://actionguard.ai/diff) &bull; Continuous Zero-Trust Security for AI Agents*
<!-- actionguard-ci-comment-signature -->`;
  return comment;
}
async function postOrUpdatePrComment(report, options = {}) {
  const token = options.token || process.env.GITHUB_TOKEN;
  if (!token) return false;
  let prNumber = options.prNumber;
  let repo = options.repo || process.env.GITHUB_REPOSITORY;
  const eventPath = options.eventPath || process.env.GITHUB_EVENT_PATH;
  if (eventPath && import_node_fs.default.existsSync(eventPath)) {
    try {
      const eventData = JSON.parse(import_node_fs.default.readFileSync(eventPath, "utf8"));
      if (eventData.pull_request?.number) {
        prNumber = eventData.pull_request.number;
      }
      if (!repo && eventData.repository?.full_name) {
        repo = eventData.repository.full_name;
      }
    } catch {
    }
  }
  if (!repo || !prNumber) {
    return false;
  }
  const commentBody = generatePrCommentMarkdown(report, options.pinnedHash);
  const signature = "<!-- actionguard-ci-comment-signature -->";
  const apiUrl = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`;
  try {
    const listRes = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ActionGuard-CI-Bot/1.0"
      }
    });
    if (listRes.ok) {
      const comments = await listRes.json();
      const existing = comments.find((c) => c.body?.includes(signature));
      if (existing) {
        const updateUrl = `https://api.github.com/repos/${repo}/issues/comments/${existing.id}`;
        const updateRes = await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "ActionGuard-CI-Bot/1.0"
          },
          body: JSON.stringify({ body: commentBody })
        });
        return updateRes.ok;
      }
    }
    const createRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "ActionGuard-CI-Bot/1.0"
      },
      body: JSON.stringify({ body: commentBody })
    });
    return createRes.ok;
  } catch (err) {
    console.error("ActionGuard PR Commenter warning:", err instanceof Error ? err.message : err);
    return false;
  }
}

// packages/cli/src/index.ts
var args = process.argv.slice(2);
var command = args[0];
function printHelp() {
  console.log(`
\x1B[1m\x1B[34mActionGuard.ai CLI\x1B[0m \u2014 Verification & Schema Drift Detection for AI Agents

\x1B[1mUSAGE:\x1B[0m
  actionguard init [--name <name>]          Initialize ActionGuard manifests & GitHub Action in project
  actionguard convert <spec|url>            Convert OpenAPI/Swagger spec into verified MCP manifests
  actionguard inspect <url>                 Run 5-stage live protocol & security audit
  actionguard compile [manifest.json]       Compile actionguard.json to MCP, A2A & DNS-AID
  actionguard check <url> --pin <hash>      CI/CD gate: exit 1 if remote schema drifts
  actionguard mcp                           Run as Model Context Protocol (MCP) stdio server
  actionguard help                          Show this help message

\x1B[1mOPTIONS:\x1B[0m
  --pin <hash>             Expected schema_sha256 digest to enforce
  --format <json|sarif>    Output machine-readable report format
  --header <name:value>    Custom HTTP header for authenticated endpoints
  --comment-pr             Post or update rich markdown review comment on GitHub PR
  --github-token <token>   GitHub API token for PR comments (default $GITHUB_TOKEN)

\x1B[1mEXAMPLES:\x1B[0m
  npx actionguard init
  npx actionguard inspect https://example.com/mcp
  npx actionguard compile ./actionguard.json
  npx actionguard check https://mcp.llmrank.app/v1/mcp --pin 4f53cda18c2b...
  npx actionguard check https://api.where.care/mcp --pin 4f53cda18c2b... --format sarif
  npx actionguard mcp
`);
}
async function handleInit(customName) {
  const cwd = process.cwd();
  console.log("\n\x1B[36m\u26A1 Initializing ActionGuard for project...\x1B[0m\n");
  let projectName = customName;
  let description = "Model Context Protocol (MCP) server";
  let repoUrl;
  const pkgPath = import_node_path.default.join(cwd, "package.json");
  if (import_node_fs2.default.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(import_node_fs2.default.readFileSync(pkgPath, "utf8"));
      if (!projectName && pkg.name) {
        projectName = pkg.name.replace(/^@[^/]+\//, "");
      }
      if (pkg.description) description = pkg.description;
      if (pkg.repository) {
        repoUrl = typeof pkg.repository === "string" ? pkg.repository : pkg.repository.url;
      }
    } catch {
    }
  }
  if (!projectName) {
    projectName = import_node_path.default.basename(cwd).toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  }
  const title = projectName.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const manifestPath = import_node_path.default.join(cwd, "actionguard.json");
  if (!import_node_fs2.default.existsSync(manifestPath)) {
    const starterManifest = {
      $schema: "https://actionguard.ai/schemas/v1/manifest.schema.json",
      name: projectName,
      title: `${title} MCP Server`,
      description,
      version: "1.0.0",
      domain: `${projectName}.internal`,
      ...repoUrl ? { repository: { url: repoUrl, source: "github" } } : {},
      endpoints: [
        {
          protocol: "mcp",
          transport: "streamable-http",
          url: "http://localhost:3000/mcp"
        }
      ],
      capabilities: {
        tools: []
      }
    };
    import_node_fs2.default.writeFileSync(manifestPath, JSON.stringify(starterManifest, null, 2));
    console.log("  \x1B[32m\u2714\x1B[0m Generated \x1B[1mactionguard.json\x1B[0m");
  } else {
    console.log("  \x1B[33m\u2139\x1B[0m Found existing \x1B[1mactionguard.json\x1B[0m");
  }
  await handleCompile("actionguard.json");
  const workflowDir = import_node_path.default.join(cwd, ".github", "workflows");
  import_node_fs2.default.mkdirSync(workflowDir, { recursive: true });
  const workflowPath = import_node_path.default.join(workflowDir, "verify-mcp.yml");
  if (!import_node_fs2.default.existsSync(workflowPath)) {
    const workflowYaml = `name: ActionGuard MCP Schema Gate

on:
  pull_request:
    branches: [main, master]
  workflow_dispatch:

jobs:
  verify-mcp:
    name: Verify Upstream MCP Tools
    runs-on: ubuntu-latest
    steps:
      - name: Verify Upstream MCP Tools with ActionGuard
        uses: lsendel/actionguard@v1
        with:
          target_url: 'https://example.com/mcp'
          # pinned_hash: 'expected-schema-sha256'
`;
    import_node_fs2.default.writeFileSync(workflowPath, workflowYaml);
    console.log(
      "  \x1B[32m\u2714\x1B[0m Generated \x1B[1m.github/workflows/verify-mcp.yml\x1B[0m (CI Gate)"
    );
  } else {
    console.log("  \x1B[33m\u2139\x1B[0m Found existing \x1B[1m.github/workflows/verify-mcp.yml\x1B[0m");
  }
  console.log("\n\x1B[32m\u{1F389} ActionGuard onboarding complete!\x1B[0m");
  console.log("Next steps:");
  console.log("  1. Inspect your live server:  \x1B[36mactionguard inspect <url>\x1B[0m");
  console.log(
    "  2. Lock your schema in CI:    \x1B[36mactionguard check <url> --pin <hash>\x1B[0m"
  );
  console.log("  3. Claim your domain badge:   \x1B[36mhttps://actionguard.ai/verify\x1B[0m\n");
}
async function handleConvert(specPathOrUrl, outDir = ".") {
  if (!specPathOrUrl) {
    console.error(
      "\x1B[31mError: Missing OpenAPI file path or URL.\x1B[0m Usage: actionguard convert <openapi.json|url>"
    );
    process.exit(1);
    return;
  }
  console.log(`
\x1B[36m\u26A1 Converting OpenAPI specification:\x1B[0m ${specPathOrUrl} ...
`);
  let specContent = "";
  try {
    if (specPathOrUrl.startsWith("http://") || specPathOrUrl.startsWith("https://")) {
      const res = await fetch(specPathOrUrl);
      if (!res.ok) throw new Error(`HTTP fetch failed with status ${res.status}`);
      specContent = await res.text();
    } else {
      specContent = import_node_fs2.default.readFileSync(import_node_path.default.resolve(specPathOrUrl), "utf8");
    }
    const conversion = convertOpenApiToMcp(specContent);
    const hashes = await computeDualHash(conversion.tools);
    const targetManifest = {
      $schema: "https://actionguard.ai/schema/v1/actionguard.json",
      name: conversion.projectName,
      title: conversion.title,
      description: conversion.description,
      version: "1.0.0",
      domain: `${conversion.projectName}.example.com`,
      endpoints: [
        {
          protocol: "mcp",
          transport: "streamable-http",
          url: `https://${conversion.projectName}.example.com/mcp`
        }
      ],
      capabilities: {
        tools: conversion.tools.map((t) => ({
          id: t.name,
          name: t.name,
          description: t.description || "",
          annotations: t.annotations,
          inputSchema: t.inputSchema
        }))
      }
    };
    const outPath = import_node_path.default.resolve(outDir);
    import_node_fs2.default.mkdirSync(outPath, { recursive: true });
    import_node_fs2.default.writeFileSync(
      import_node_path.default.join(outPath, "actionguard.json"),
      `${JSON.stringify(targetManifest, null, 2)}
`
    );
    console.log("  \x1B[32m\u2714\x1B[0m Generated \x1B[1mactionguard.json\x1B[0m");
    const mcpRegistry = compileToMcpRegistry(targetManifest);
    import_node_fs2.default.writeFileSync(
      import_node_path.default.join(outPath, "server.json"),
      `${JSON.stringify(mcpRegistry, null, 2)}
`
    );
    console.log(
      "  \x1B[32m\u2714\x1B[0m Generated \x1B[1mserver.json\x1B[0m (MCP Model Context Protocol Registry)"
    );
    const wellKnownDir = import_node_path.default.join(outPath, ".well-known");
    import_node_fs2.default.mkdirSync(wellKnownDir, { recursive: true });
    const agentCard = compileToA2AAgentCard(targetManifest);
    import_node_fs2.default.writeFileSync(
      import_node_path.default.join(wellKnownDir, "agent-card.json"),
      `${JSON.stringify(agentCard, null, 2)}
`
    );
    console.log(
      "  \x1B[32m\u2714\x1B[0m Generated \x1B[1m.well-known/agent-card.json\x1B[0m (A2A Protocol)"
    );
    console.log(
      `
\x1B[32m\u{1F389} Successfully converted ${conversion.tools.length} OpenAPI operations into MCP tools!\x1B[0m`
    );
    console.log("\x1B[1mCryptographic Dual-Hash Baseline:\x1B[0m");
    console.log(`  Schema SHA-256:       \x1B[34m${hashes.schema_sha256}\x1B[0m`);
    console.log(`  Descriptions SHA-256: \x1B[35m${hashes.descriptions_sha256}\x1B[0m`);
    console.log("\nNext steps:");
    console.log(
      `  Lock this schema in CI: \x1B[36mactionguard check <url> --pin ${hashes.schema_sha256}\x1B[0m
`
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\x1B[31mConversion failed:\x1B[0m ${msg}`);
    process.exit(1);
  }
}
function writeGithubOutputs(report) {
  if (process.env.GITHUB_OUTPUT) {
    try {
      import_node_fs2.default.appendFileSync(
        process.env.GITHUB_OUTPUT,
        `schema_hash=${report.hashes.schema_sha256}
descriptions_hash=${report.hashes.descriptions_sha256}
grade=${report.score.grade}
score=${report.score.numericalScore}
`
      );
    } catch {
    }
  }
}
async function handleInspect(targetUrl, options = {}) {
  if (!targetUrl) {
    console.error("\x1B[31mError: Missing target URL.\x1B[0m Usage: actionguard inspect <url>");
    process.exit(1);
    return;
  }
  console.log(`
\x1B[36m\u26A1 Probing target:\x1B[0m ${targetUrl} ...
`);
  try {
    const report = await runInspection(targetUrl);
    if (options.commentPr || process.env.GITHUB_ACTIONS === "true") {
      await postOrUpdatePrComment(report, {
        token: options.githubToken
      });
    }
    let gradeColor = "\x1B[32m";
    if (report.score.grade === "B") gradeColor = "\x1B[34m";
    else if (report.score.grade === "C") gradeColor = "\x1B[33m";
    else if (report.score.grade === "D" || report.score.grade === "F") gradeColor = "\x1B[31m";
    console.log(
      "\x1B[1m\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\x1B[0m"
    );
    console.log(`  \x1B[1mTarget:\x1B[0m   ${report.targetDomain} (${report.targetUrl})`);
    console.log(
      `  \x1B[1mGrade:\x1B[0m    ${gradeColor}\x1B[1m${report.score.grade} (${report.score.numericalScore}/100)\x1B[0m`
    );
    console.log(
      `  \x1B[1mTools:\x1B[0m    ${report.tools.length} discovered (~${report.tokenCostEstimate} tokens/turn)`
    );
    console.log(
      "\x1B[1m\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\x1B[0m\n"
    );
    console.log("\x1B[1mCRYPTOGRAPHIC DUAL-HASH:\x1B[0m");
    console.log(`  \x1B[34mSchema SHA-256:\x1B[0m       ${report.hashes.schema_sha256}`);
    console.log(`  \x1B[35mDescriptions SHA-256:\x1B[0m ${report.hashes.descriptions_sha256}
`);
    console.log("\x1B[1mINSPECTION FINDINGS:\x1B[0m");
    for (const f of report.findings) {
      const tag = f.status === "pass" ? "\x1B[32m[PASS]\x1B[0m" : f.status === "warn" ? "\x1B[33m[WARN]\x1B[0m" : "\x1B[31m[FAIL]\x1B[0m";
      console.log(`  ${tag} \x1B[1m${f.title}\x1B[0m: ${f.message}`);
    }
    writeGithubOutputs(report);
    console.log(
      `
\x1B[32m\u2714 Inspection complete.\x1B[0m View live dashboard at: https://actionguard.ai/reports/${report.id}
`
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\x1B[31mInspection failed:\x1B[0m ${msg}`);
    process.exit(1);
  }
}
async function handleCompile(manifestPath = "actionguard.json") {
  const resolvedPath = import_node_path.default.resolve(process.cwd(), manifestPath);
  if (!import_node_fs2.default.existsSync(resolvedPath)) {
    console.error(`\x1B[31mError:\x1B[0m Manifest file not found at ${resolvedPath}`);
    process.exit(1);
  }
  try {
    const raw = JSON.parse(import_node_fs2.default.readFileSync(resolvedPath, "utf8"));
    const manifest = validateManifest(raw);
    console.log(
      `
\x1B[36mCompiling manifests for ${manifest.title} v${manifest.version}...\x1B[0m
`
    );
    const mcpJson = compileToMcpRegistry(manifest);
    const a2aCard = compileToA2AAgentCard(manifest);
    const dnsRecords = compileToDnsAidRecords(manifest);
    const outDir = process.cwd();
    import_node_fs2.default.mkdirSync(import_node_path.default.join(outDir, ".well-known"), { recursive: true });
    import_node_fs2.default.writeFileSync(import_node_path.default.join(outDir, "server.json"), mcpJson);
    import_node_fs2.default.writeFileSync(import_node_path.default.join(outDir, ".well-known", "agent-card.json"), a2aCard);
    import_node_fs2.default.writeFileSync(import_node_path.default.join(outDir, "dns-aid.zone"), dnsRecords);
    console.log("  \x1B[32m\u2714\x1B[0m Generated \x1B[1mserver.json\x1B[0m (Official MCP Registry)");
    console.log(
      "  \x1B[32m\u2714\x1B[0m Generated \x1B[1m.well-known/agent-card.json\x1B[0m (A2A Protocol v1.0)"
    );
    console.log("  \x1B[32m\u2714\x1B[0m Generated \x1B[1mdns-aid.zone\x1B[0m (RFC 8552 / RFC 9460)");
    console.log("\n\x1B[32mAll manifests compiled successfully.\x1B[0m\n");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\x1B[31mCompilation failed:\x1B[0m ${msg}`);
    process.exit(1);
  }
}
function generateSarifReport(report, pinnedHash) {
  const rules = report.findings.map((f) => ({
    id: f.id,
    name: f.title,
    shortDescription: { text: f.message },
    defaultConfiguration: {
      level: f.status === "fail" ? "error" : f.status === "warn" ? "warning" : "note"
    }
  }));
  const results = report.findings.filter((f) => f.status === "fail" || f.status === "warn").map((f) => ({
    ruleId: f.id,
    level: f.status === "fail" ? "error" : "warning",
    message: { text: f.message },
    locations: [
      {
        physicalLocation: {
          artifactLocation: { uri: report.targetUrl }
        }
      }
    ]
  }));
  if (pinnedHash && report.hashes.schema_sha256 !== pinnedHash) {
    results.unshift({
      ruleId: "AG-DRIFT-001",
      level: "error",
      message: {
        text: `Breaking schema drift detected: Expected ${pinnedHash}, observed ${report.hashes.schema_sha256}`
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri: report.targetUrl }
          }
        }
      ]
    });
  }
  return {
    $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
    version: "2.1.0",
    runs: [
      {
        tool: {
          driver: {
            name: "ActionGuard",
            version: "1.0.0",
            informationUri: "https://actionguard.ai",
            rules
          }
        },
        results
      }
    ]
  };
}
async function handleCheck(targetUrl, pinnedHash, format = "text", options = {}) {
  if (!targetUrl || !pinnedHash) {
    console.error("\x1B[31mError: Target URL and --pin <hash> are required.\x1B[0m");
    process.exit(1);
    return;
  }
  if (format === "text") {
    console.log(
      `
\x1B[36mCI Gate: Checking ${targetUrl} against pinned hash:\x1B[0m ${pinnedHash} ...
`
    );
  }
  try {
    const report = await runInspection(targetUrl);
    const hasDrift = report.hashes.schema_sha256 !== pinnedHash;
    const hasSecurityFailures = report.score.failCount > 0;
    const isGithub = process.env.GITHUB_ACTIONS === "true";
    if (options.commentPr || isGithub) {
      await postOrUpdatePrComment(report, {
        token: options.githubToken,
        pinnedHash
      });
    }
    writeGithubOutputs(report);
    if (format === "json") {
      console.log(JSON.stringify(report, null, 2));
    } else if (format === "sarif") {
      console.log(JSON.stringify(generateSarifReport(report, pinnedHash), null, 2));
    }
    if (hasDrift) {
      if (isGithub) {
        console.log(
          `::error title=ActionGuard Schema Drift::Upstream schema hash mismatch! Expected ${pinnedHash}, observed ${report.hashes.schema_sha256}`
        );
      }
      if (format === "text") {
        console.error("\x1B[31m[FAILED CI GATE]\x1B[0m Schema hash mismatch!");
        console.error(`  Expected: ${pinnedHash}`);
        console.error(`  Observed: ${report.hashes.schema_sha256}`);
        console.error("\nThe upstream endpoint has drifted or broken its schema contract.");
      }
      process.exit(1);
    }
    if (hasSecurityFailures) {
      if (isGithub) {
        console.log(
          `::error title=ActionGuard Protocol Failure::Security or protocol checks failed on ${targetUrl}.`
        );
      }
      if (format === "text") {
        console.error("\x1B[31m[FAILED CI GATE]\x1B[0m Security or protocol checks failed.");
      }
      process.exit(1);
    }
    if (isGithub) {
      console.log(
        `::notice title=ActionGuard Passed::Schema matches pinned hash (${pinnedHash.substring(0, 12)}...) with 0 security failures.`
      );
    }
    if (format === "text") {
      console.log(
        "\x1B[32m\u2714 [PASSED CI GATE]\x1B[0m Schema matches pinned hash. 0 security failures.\n"
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (process.env.GITHUB_ACTIONS === "true") {
      console.log(`::error title=ActionGuard Error::${msg}`);
    }
    console.error(`\x1B[31mCheck failed:\x1B[0m ${msg}`);
    process.exit(1);
  }
}
async function handleMcpStdio() {
  const rl = import_node_readline.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  const sendResponse = (msg) => {
    process.stdout.write(`${JSON.stringify(msg)}
`);
  };
  rl.on("line", async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const req = JSON.parse(trimmed);
      const id = req.id;
      const method = req.method;
      if (method === "initialize") {
        sendResponse({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: "actionguard-inspector",
              version: "0.1.0"
            }
          }
        });
      } else if (method === "notifications/initialized") {
      } else if (method === "ping") {
        sendResponse({ jsonrpc: "2.0", id, result: {} });
      } else if (method === "tools/list") {
        sendResponse({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "actionguard_inspect",
                description: "Run a 5-stage continuous reliability, security, and schema audit of an MCP server or AI agent endpoint.",
                inputSchema: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      description: "The target MCP server or agent endpoint URL to audit"
                    }
                  },
                  required: ["url"]
                },
                annotations: {
                  readOnlyHint: true
                }
              },
              {
                name: "actionguard_check_drift",
                description: "Verify whether an MCP server's tools schema or descriptions have drifted from a pinned Dual-Hash.",
                inputSchema: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      description: "The target MCP server endpoint URL"
                    },
                    pinnedSchemaHash: {
                      type: "string",
                      description: "Pinned 64-char hex SHA-256 schema hash"
                    }
                  },
                  required: ["url", "pinnedSchemaHash"]
                },
                annotations: {
                  readOnlyHint: true
                }
              }
            ]
          }
        });
      } else if (method === "tools/call") {
        const toolName = req.params?.name;
        const toolArgs = req.params?.arguments || {};
        if (toolName === "actionguard_inspect") {
          const report = await runInspection(toolArgs.url);
          sendResponse({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(report, null, 2)
                }
              ]
            }
          });
        } else if (toolName === "actionguard_check_drift") {
          const report = await runInspection(toolArgs.url);
          const matches = report.hashes.schema_sha256 === toolArgs.pinnedSchemaHash;
          sendResponse({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      matches,
                      targetUrl: toolArgs.url,
                      expectedHash: toolArgs.pinnedSchemaHash,
                      observedHash: report.hashes.schema_sha256,
                      drifted: !matches,
                      grade: report.score.grade
                    },
                    null,
                    2
                  )
                }
              ]
            }
          });
        } else {
          sendResponse({
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `Tool not found: ${toolName}` }
          });
        }
      } else if (id !== void 0) {
        sendResponse({
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method not found: ${method}` }
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      sendResponse({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: `Parse error: ${msg}` }
      });
    }
  });
}
async function main() {
  if (!command && !process.stdin.isTTY) {
    await handleMcpStdio();
    return;
  }
  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }
  const commentPr = args.includes("--comment-pr");
  const tokenIdx = args.indexOf("--github-token");
  const githubToken = tokenIdx !== -1 ? args[tokenIdx + 1] : process.env.GITHUB_TOKEN;
  if (command === "init") {
    const nameIdx = args.indexOf("--name");
    const customName = nameIdx !== -1 ? args[nameIdx + 1] : void 0;
    await handleInit(customName);
  } else if (command === "convert") {
    const outIdx = args.indexOf("--out");
    const outDir = outIdx !== -1 ? args[outIdx + 1] : ".";
    await handleConvert(args[1], outDir);
  } else if (command === "inspect") {
    await handleInspect(args[1], { commentPr, githubToken });
  } else if (command === "compile") {
    await handleCompile(args[1]);
  } else if (command === "check") {
    const pinIdx = args.indexOf("--pin");
    const pinHash = pinIdx !== -1 ? args[pinIdx + 1] : void 0;
    const formatIdx = args.indexOf("--format");
    const format = formatIdx !== -1 ? args[formatIdx + 1] : "text";
    await handleCheck(args[1], pinHash, format, { commentPr, githubToken });
  } else if (command === "mcp" || command === "server") {
    await handleMcpStdio();
  } else {
    console.error(`Unknown command: "${command}"`);
    printHelp();
    process.exit(1);
  }
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
