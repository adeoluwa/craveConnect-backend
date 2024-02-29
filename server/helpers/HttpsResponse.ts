class HttpStatusCode {
  /*  */
  static HTTP_OK = 200;

  static HTTP_CONTINUE = 100;

  static HTTP_SWITCHING_PROTOCOLS = 101;

  static HTTP_PROCESSING = 102;

  static HTTP_CREATED = 201;

  static HTTP_ACCEPTED = 202;

  static HTTP_NON_AUTHORITATIVE_INFORMATIOM = 203;

  static HTTP_NO_CONTENT = 204;

  static HTTP_RESET_CONTENT = 205;

  static HTTP_PARTIAL_CONTENT = 206;

  static HTTP_MULTI_STATUS = 207;

  /** 208 */
  static HTTP_ALREADY_REPORTED = 208; // RFC5842

  /** 226 */
  static HTTP_IM_USED = 226; // RFC3229

  /** 300 */
  static HTTP_MULTIPLE_CHOICES = 300;

  /** 301 */
  static HTTP_MOVED_PERMANENTLY = 301;

  /** 302 */
  static HTTP_FOUND = 302;

  /** 303 */
  static HTTP_SEE_OTHER = 303;

  /** 304 */
  static HTTP_NOT_MODIFIED = 304;

  /** 305 */
  static HTTP_USE_PROXY = 305;

  /** 306 */
  static HTTP_RESERVED = 306;

  /** 307 */
  static HTTP_TEMPORARY_REDIRECT = 307;

  /** 308 */
  static HTTP_PERMANENTLY_REDIRECT = 308; // RFC7238

  /** 400 */
  static HTTP_BAD_REQUEST = 400;

  /** 401 */
  static HTTP_UNAUTHORIZED = 401;

  /** 402 */
  static HTTP_PAYMENT_REQUIRED = 402;

  /** 403 */
  static HTTP_FORBIDDEN = 403;

  /** 404 */
  static HTTP_NOT_FOUND = 404;

  /** 405 */
  static HTTP_METHOD_NOT_ALLOWED = 405;

  /** 406 */
  static HTTP_NOT_ACCEPTABLE = 406;

  /** 407 */
  static HTTP_PROXY_AUTHENTICATION_REQUIRED = 407;

  /** 408 */
  static HTTP_REQUEST_TIMEOUT = 408;

  /** 409 */
  static HTTP_CONFLICT = 409;

  /** 410 */
  static HTTP_GONE = 410;

  /** 411 */
  static HTTP_LENGTH_REQUIRED = 411;

  /** 412 */
  static HTTP_PRECONDITION_FAILED = 412;

  /** 413 */
  static HTTP_REQUEST_ENTITY_TOO_LARGE = 413;

  /** 414 */
  static HTTP_REQUEST_URI_TOO_LONG = 414;

  /** 415 */
  static HTTP_UNSUPPORTED_MEDIA_TYPE = 415;

  /** 416 */
  static HTTP_REQUESTED_RANGE_NOT_SATISFIABLE = 416;

  /** 417 */
  static HTTP_EXPECTATION_FAILED = 417;

  /** 418 */
  static HTTP_I_AM_A_TEAPOT = 418; // RFC2324

  /** 421 */
  static HTTP_MISDIRECTED_REQUEST = 421; // RFC7540

  /** 422 */
  static HTTP_UNPROCESSABLE_ENTITY = 422; // RFC4918

  /** 423 */
  static HTTP_LOCKED = 423; // RFC4918

  /** 424 */
  static HTTP_FAILED_DEPENDENCY = 424; // RFC4918

  /** 425 */
  static HTTP_RESERVED_FOR_WEBDAV_ADVANCED_COLLECTIONS_EXPIRED_PROPOSAL = 425; // RFC2817

  /** 426 */
  static HTTP_UPGRADE_REQUIRED = 426; // RFC2817

  /** 428 */
  static HTTP_PRECONDITION_REQUIRED = 428; // RFC6585

  /** 429 */
  static HTTP_TOO_MANY_REQUESTS = 429; // RFC6585

  /** 431 */
  static HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE = 431; // RFC6585

  /** 451 */
  static HTTP_UNAVAILABLE_FOR_LEGAL_REASONS = 451;

  /** 500 */
  static HTTP_INTERNAL_SERVER_ERROR = 500;

  /** 501 */
  static HTTP_NOT_IMPLEMENTED = 501;

  /** 502 */
  static HTTP_BAD_GATEWAY = 502;

  /** 503 */
  static HTTP_SERVICE_UNAVAILABLE = 503;

  /** 504 */
  static HTTP_GATEWAY_TIMEOUT = 504;

  /** 505 */
  static HTTP_VERSION_NOT_SUPPORTED = 505;

  /** 506 */
  static HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL = 506; // RFC2295

  /** 507 */
  static HTTP_INSUFFICIENT_STORAGE = 507; // RFC4918

  /** 508 */
  static HTTP_LOOP_DETECTED = 508; // RFC5842

  /** 510 */
  static HTTP_NOT_EXTENDED = 510; // RFC2774

  /** 511 */
  static HTTP_NETWORK_AUTHENTICATION_REQUIRED = 511;
}

export default HttpStatusCode;