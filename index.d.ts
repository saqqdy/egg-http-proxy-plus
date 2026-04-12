import { Context, Application } from 'egg'
import { Options } from 'http-proxy-middleware'

/**
 * Context extension for egg-http-proxy-plus
 */
declare module 'egg' {
    interface Context {
        request: {
            rawBody?: string
            body?: unknown
            originalUrl: string
            url: string
        }
    }
}

/**
 * Proxy request callback function
 */
type ProxyReqCallback = (
    proxyReq: unknown,
    req: unknown,
    res: unknown,
    ctx: Context
) => void

/**
 * Proxy response callback function
 */
type ProxyResCallback = (
    proxyRes: unknown,
    req: unknown,
    res: unknown,
    ctx: Context
) => void

/**
 * Extended proxy options with ctx context
 */
interface ExtendedProxyOptions extends Omit<Options, 'onProxyReq' | 'onProxyRes'> {
    target: string
    onProxyReq?: ProxyReqCallback
    onProxyRes?: ProxyResCallback
}

/**
 * Custom matching function type
 */
type CustomMatcher = (pathname: string, req: unknown) => boolean

/**
 * Single proxy configuration item
 */
interface ProxyConfigItem {
    /**
     * Path pattern to match
     * - string: single path pattern
     * - string[]: multiple path patterns
     * - function: custom matching function
     */
    origin: string | string[] | CustomMatcher
    /**
     * Proxy options, can be a target URL string or options object
     */
    options: string | ExtendedProxyOptions
}

/**
 * Object-based proxy configuration
 * Key is the path pattern, value is the target or options
 */
type ProxyConfigObject = Record<string, string | ExtendedProxyOptions>

/**
 * Main plugin configuration
 * Can be an object mapping paths to targets, or an array of detailed configs
 */
type HttpProxyPlusConfig = ProxyConfigObject | ProxyConfigItem[]

/**
 * Plugin configuration in config
 */
declare module '../config/config.default' {
    interface EggAppConfig {
        httpProxyPlus?: HttpProxyPlusConfig
    }
}

/**
 * Plugin declaration
 */
declare module 'egg' {
    interface EggPlugin {
        httpProxyPlus?: boolean
    }
}

export default HttpProxyPlusConfig
export type {
    ProxyConfigItem,
    ProxyConfigObject,
    ExtendedProxyOptions,
    ProxyReqCallback,
    ProxyResCallback,
    CustomMatcher,
    HttpProxyPlusConfig
}