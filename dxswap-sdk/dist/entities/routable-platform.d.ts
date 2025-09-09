import { BigintIsh, ChainId } from '../constants';
/**
 * A platform to which Swapr can route through.
 */
export declare class RoutablePlatform {
    readonly name: string;
    readonly factoryAddress: {
        [supportedChainId in ChainId]?: string;
    };
    readonly routerAddress: {
        [supportedChainId in ChainId]?: string;
    };
    readonly initCodeHash: {
        [supportedChainId in ChainId]?: string;
    };
    readonly defaultSwapFee: BigintIsh;
    static readonly HONEYSWAP: RoutablePlatform;
    static readonly UNISWAP: RoutablePlatform;
    static readonly SUSHISWAP: RoutablePlatform;
    static readonly SWAPR: RoutablePlatform;
    static readonly BAOSWAP: RoutablePlatform;
    static readonly QUICKSWAP: RoutablePlatform;
    constructor(name: string, factoryAddress: {
        [supportedChainId in ChainId]?: string;
    }, routerAddress: {
        [supportedChainId in ChainId]?: string;
    }, initCodeHash: {
        [supportedChainId in ChainId]?: string;
    }, defaultSwapFee: BigintIsh);
    supportsChain(chainId: ChainId): boolean;
}
