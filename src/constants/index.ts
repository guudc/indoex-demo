import { AbstractConnector } from '@web3-react/abstract-connector'
import { ChainId, JSBI, Percent, CurrencyAmount, WETH, WSPOA, WXDAI, Token, Currency, WMATIC } from 'dxswap-sdk'
import { tokens } from './tokens'
import { injected, walletConnectMATIC, walletConnectXDAI, walletlink, uauth } from '../connectors'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const timeframeOptions = {
  // WEEK: '1 week',
  MONTH: '1 month',
  // THREE_MONTHS: '3 months',
  YEAR: '1 year',
  ALL_TIME: 'All time'
}

export const PROTOCOLS_API = 'https://api.llama.fi/lite/protocols2'

export const DAI: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  [ChainId.XDAI]: new Token(ChainId.XDAI, '0x44fa8e6f47987339850636f88629646662444217', 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.MUMBAI_TESTNET]: new Token(
    ChainId.MUMBAI_TESTNET,
    '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
  [ChainId.AVAX]: new Token(
    ChainId.AVAX,
    '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    18,
    'DAI',
    'Dai Stablecoin'
  )
}

export const USDC: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 'USDC', 'USD//C'),
  [ChainId.XDAI]: new Token(
    ChainId.XDAI,
    '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
    6,
    'USDC',
    'USD//C from Ethereum'
  ),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 6, 'USDC', 'PoS USDC'),
  [ChainId.MUMBAI_TESTNET]: new Token(
    ChainId.MUMBAI_TESTNET,
    '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
    18,
    'USDC',
    'PoS USDC'
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    18,
    'USDC',
    'PoS USDC'
  ),
  [ChainId.AVAX]: new Token(
    ChainId.AVAX,
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    18,
    'USDC',
    'PoS USDC'
  )
}

export const USDT: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD'),
  [ChainId.XDAI]: new Token(
    ChainId.XDAI,
    '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
    6,
    'USDT',
    'Tether USD from Ethereum'
  ),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 6, 'USDT', 'PoS Tether USD'),
  [ChainId.MUMBAI_TESTNET]: new Token(
    ChainId.MUMBAI_TESTNET,
    '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832',
    18,
    'USDT',
    'PoS Tether USD'
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    '0x55d398326f99059ff775485246999027b3197955',
    18,
    'USDT',
    'Binance-Peg BSC-USD'
  )
  ,
  [ChainId.AVAX]: new Token(
    ChainId.AVAX,
    '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
    18,
    'USDT',
    'PoS Tether USD'
  )
}

export const WBTC: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    18,
    'WBTC',
    'Wrapped BTC'
  ),
  [ChainId.XDAI]: new Token(
    ChainId.XDAI,
    '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252',
    18,
    'WBTC',
    'Wrapped BTC from Ethereum'
  )
}

export const HONEY: { [key: number]: Token } = {
  [ChainId.XDAI]: new Token(ChainId.XDAI, '0x71850b7e9ee3f13ab46d67167341e4bdc905eef9', 18, 'HNY', 'Honey'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0xb371248dd0f9e4061ccf8850e9223ca48aa7ca4b', 18, 'HNY', 'Honey')
}

export const STAKE = new Token(
  ChainId.XDAI,
  '0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e',
  18,
  'STAKE',
  'Stake Token on xDai'
)

export const BAO = new Token(
  ChainId.XDAI,
  '0x82dFe19164729949fD66Da1a37BC70dD6c4746ce',
  18,
  'BAO',
  'BaoToken from Ethereum'
)

export const AGAVE = new Token(ChainId.XDAI, '0x3a97704a1b25F08aa230ae53B352e2e72ef52843', 18, 'AGVE', 'Agave token')

export const SURF = new Token(ChainId.MATIC, '0x1e42edbe5376e717c1b22904c59e406426e8173f', 18, 'SURF', 'SURF.Finance')
export const WAVE = new Token(ChainId.MATIC, '0x4de7fea447b837d7e77848a4b6c0662a64a84e14', 18, 'WAVE', 'WAVE Token')
export const MWETH = new Token(
  ChainId.MUMBAI_TESTNET,
  '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
  18,
  'WETH',
  'WETH Token'
)
export const MWMAIC = new Token(
  ChainId.MUMBAI_TESTNET,
  '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
  18,
  'WMATIC',
  'Wrapped Matic Token'
)
export const MUSDC = new Token(
  ChainId.MUMBAI_TESTNET,
  '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
  18,
  'WMATIC',
  'USDC Token'
)
export const MINDO = new Token(
  ChainId.MUMBAI_TESTNET,
  '0xb963Ef97dab883a89f600CFb4226013E16f982b3',
  18,
  'WINDO',
  'INDO Token'
)
export const INDO: { [key: number]: Token } = {
  [ChainId.AVAX]: new Token(ChainId.AVAX, '0xC87215F93cf77C3A265E2876489C8Bc3DfFd4Fba', 18, 'IND', 'INDO EX'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0xC87215F93cf77C3A265E2876489C8Bc3DfFd4Fba', 18, 'IND', 'INDO EX'),
  [ChainId.BSC_TESTNET]: new Token(ChainId.BSC_TESTNET, '0xc87215f93cf77c3a265e2876489c8bc3dffd4fba', 18, 'IND', 'INDO EX')
}
//set the logo url
 
export const WBNB = new Token(
  ChainId.BSC_TESTNET,
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  18,
  'WBNB',
  'Wrapped BNB Token'
)
export const WAVAX = new Token(
  ChainId.AVAX,
  '0x30C4B42d5bC3CCA1F4F449d11EC0E63D56b5c1e7',
  18,
  'WAVAX',
  'Wrapped AVAX Token'
)
export const TST1 = new Token(
  ChainId.BSC_TESTNET,
  '0x3CEf2404Ed8524aD326AAb1eb5e9fb68C1396C8a',
  18,
  'TST1',
  'Test Token 1'
)
export const TST2 = new Token(
  ChainId.BSC_TESTNET,
  '0x8C7d5bb8FB03a588cAEEd12e221Fe3e09f7fbA15',
  18,
  'TST2',
  'Test Token 2'
)
export const RTST1 = new Token(
  ChainId.RINKEBY,
  '0x3CEf2404Ed8524aD326AAb1eb5e9fb68C1396C8a',
  18,
  'TST1',
  'Test Token 1'
)
export const RTST2 = new Token(
  ChainId.RINKEBY,
  '0x8C7d5bb8FB03a588cAEEd12e221Fe3e09f7fbA15',
  18,
  'TST2',
  'Test Token 2'
)

export const GIV = new Token(
  ChainId.XDAI,
  '0x4f4f9b8d5b4d0dc10506e5551b0513b61fd59e75',
  18,
  'GIV',
  'Giveth from Mainnet'
)
export const TEC = new Token(
  ChainId.XDAI,
  '0x5df8339c5e282ee48c0c7ce8a7d01a73d38b3b27',
  18,
  'TEC',
  'Token Engineering Commons'
)

export const GNO = new Token(
  ChainId.XDAI,
  '0x9c58bacc331c9aa871afd802db6379a98e80cedb',
  18,
  'GNO',
  'Gnosis Token from Ethereum'
)

export const WATER = new Token(ChainId.XDAI, '0x4291F029B9e7acb02D49428458cf6fceAC545f81', 18, 'WATER', 'Water Token')

export const BRIGHT = new Token(
  ChainId.XDAI,
  '0x83FF60E2f93F8eDD0637Ef669C69D5Fb4f64cA8E',
  18,
  'BRIGHT',
  'Bright from Ethereum'
)

export const WORK = new Token(
  ChainId.XDAI,
  '0xA187153C9E2bbAdEe5782D6b604cb1007bc6a86A',
  18,
  'WORK',
  'The Employment Commons Work Token from Mainnet'
)

export const FOX = new Token(ChainId.XDAI, '0x21a42669643f45Bc0e086b8Fc2ed70c23D67509d', 18, 'FOX', 'FOX from Ethereum')

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MAINNET]: [
    WETH[ChainId.MAINNET],
    DAI[ChainId.MAINNET],
    USDC[ChainId.MAINNET],
    WBTC[ChainId.MAINNET],
    USDT[ChainId.MAINNET]
  ],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY], RTST1, RTST2],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.ARBITRUM_TESTNET_V3]: [WETH[ChainId.ARBITRUM_TESTNET_V3]],
  [ChainId.SOKOL]: [WSPOA[ChainId.SOKOL]],
  [ChainId.XDAI]: [
    WXDAI[ChainId.XDAI],
    WETH[ChainId.XDAI],
    USDC[ChainId.XDAI],
    USDT[ChainId.XDAI],
    WBTC[ChainId.XDAI],
    // HONEY[ChainId.XDAI],
    AGAVE,
    GIV,
    TEC,
    GNO,
    WATER,
    BRIGHT,
    WORK,
    FOX
  ],
  [ChainId.MATIC]: [
    WETH[ChainId.MATIC],
    WMATIC[ChainId.MATIC],
    INDO[ChainId.MATIC],
    DAI[ChainId.MATIC],
    USDC[ChainId.MATIC],
    USDT[ChainId.MATIC],
    SURF,
    WAVE
  ],
  [ChainId.MUMBAI_TESTNET]: [MWETH, MWMAIC, MUSDC, MINDO],
  [ChainId.BSC_TESTNET]: [WBNB, INDO[ChainId.BSC_TESTNET], USDT[ChainId.BSC_TESTNET], USDC[ChainId.BSC_TESTNET]],
  [ChainId.AVAX]: [WAVAX, INDO[ChainId.AVAX], USDT[ChainId.AVAX], USDC[ChainId.AVAX]]
}

// used for display in the default list when adding liquidity (native currency is already shown
// by default, so no need to add the wrapper to the list)
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.MAINNET]: [DAI[ChainId.MAINNET], USDC[ChainId.MAINNET], USDT[ChainId.MAINNET], WBTC[ChainId.MAINNET]],
  [ChainId.RINKEBY]: [],
  [ChainId.ROPSTEN]: [],
  [ChainId.ARBITRUM_TESTNET_V3]: [],
  [ChainId.SOKOL]: [],
  [ChainId.XDAI]: [WETH[ChainId.XDAI], USDC[ChainId.XDAI], HONEY[ChainId.XDAI]],
  [ChainId.MATIC]: [WETH[ChainId.MATIC], INDO[ChainId.MATIC]],
  [ChainId.MUMBAI_TESTNET]: [MWETH, MINDO],
  [ChainId.BSC_TESTNET]: [WBNB, INDO[ChainId.BSC_TESTNET]],
  [ChainId.AVAX]: [USDT[ChainId.AVAX], INDO[ChainId.AVAX]]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], DAI[ChainId.MAINNET], USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.ARBITRUM_TESTNET_V3]: [WETH[ChainId.ARBITRUM_TESTNET_V3]],
  [ChainId.SOKOL]: [Token.WSPOA[ChainId.SOKOL]],
  [ChainId.XDAI]: [WXDAI[ChainId.XDAI], WETH[ChainId.XDAI], USDC[ChainId.XDAI], STAKE],
  [ChainId.MATIC]: [
    WMATIC[ChainId.MATIC],
    WETH[ChainId.MATIC],
    INDO[ChainId.MATIC],
    DAI[ChainId.MATIC],
    USDC[ChainId.MATIC],
    USDT[ChainId.MATIC]
  ],
  [ChainId.MUMBAI_TESTNET]: [MWETH, MWMAIC, MUSDC, MINDO],
  [ChainId.BSC_TESTNET]: [WBNB, INDO[ChainId.BSC_TESTNET], USDT[ChainId.BSC_TESTNET]],
  [ChainId.AVAX]: [INDO[ChainId.AVAX], USDT[ChainId.AVAX], USDC[ChainId.AVAX]]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]],
    [DAI[ChainId.MAINNET], USDT[ChainId.MAINNET]]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  WALLET_CONNECT_XDAI: {
    connector: walletConnectXDAI,
    name: 'WalletConnect for Gnosis Chain',
    iconName: 'wallet-connect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_CONNECT_MATIC: {
    connector: walletConnectMATIC,
    name: 'WalletConnect for Polygon',
    iconName: 'wallet-connect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_CONNECT_UD: {
    connector: uauth,
    name: 'Unstoppable Domains',
    iconName: 'default-icon-UD.png',
    description: 'Login with Unstoppable Domains',
    href: null,
    color: '#4196FC'
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const DEFAULT_TOKEN_LIST = tokens

export const ZERO_USD = CurrencyAmount.usd('0')

interface NetworkDetails {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
  metamaskAddable?: boolean
}

export const MATIC_PROJECT_ID = '917500540ed6561baeb650de48df44949ed21baf'

export const NETWORK_DETAIL: { [chainId: number]: NetworkDetails } = {
  [ChainId.MAINNET]: {
    chainId: `0x${ChainId.MAINNET.toString(16)}`,
    chainName: 'Ethereum Main Net',
    nativeCurrency: {
      name: Currency.ETHER.name || 'Ether',
      symbol: 'ETH',
      decimals: Currency.ETHER.decimals || 18
    },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io'],
    metamaskAddable: true
  },
  [ChainId.XDAI]: {
    chainId: `0x${ChainId.XDAI.toString(16)}`,
    chainName: 'Gnosis Chain',
    nativeCurrency: {
      name: Currency.XDAI.name || 'xDAI',
      symbol: Currency.XDAI.symbol || 'xDAI',
      decimals: Currency.XDAI.decimals || 18
    },
    rpcUrls: ['https://poa-xdai.gateway.pokt.network/v1/lb/61140fc659501900341babff'],
    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
    metamaskAddable: true
  },
  [ChainId.MATIC]: {
    chainId: `0x${ChainId.MATIC.toString(16)}`,
    chainName: 'Polygon',
    nativeCurrency: {
      name: Currency.MATIC.name || 'Matic',
      symbol: 'MATIC',
      decimals: Currency.MATIC.decimals || 18
    },
    // rpcUrls: [`https://rpc-mainnet.maticvigil.com/v1/${MATIC_PROJECT_ID}`],
    rpcUrls: ['https://poly-mainnet.gateway.pokt.network/v1/lb/61141e8259501900341bb3e2'],
    blockExplorerUrls: ['https://polygonscan.com/'],
    metamaskAddable: true
  },
  [ChainId.MUMBAI_TESTNET]: {
    chainId: `0x${ChainId.MUMBAI_TESTNET.toString(16)}`,
    chainName: 'MUMBAI_TESTNET',
    nativeCurrency: {
      name: Currency.MATIC.name || 'Matic',
      symbol: Currency.MATIC.symbol || 'MATIC',
      decimals: Currency.MATIC.decimals || 18
    },
    // rpcUrls: [`https://rpc-mainnet.maticvigil.com/v1/${MATIC_PROJECT_ID}`],
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    metamaskAddable: true
  },
  [ChainId.BSC_TESTNET]: {
    chainId: `0x${ChainId.BSC_TESTNET.toString(16)}`,
    chainName: 'BSC MAINNET',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    // rpcUrls: [`https://rpc-mainnet.maticvigil.com/v1/${MATIC_PROJECT_ID}`],
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
    metamaskAddable: true
  },
  [ChainId.RINKEBY]: {
    chainId: `0x${ChainId.RINKEBY.toString(16)}`,
    chainName: 'BSC_TESTNET',
    nativeCurrency: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18
    },
    // rpcUrls: [`https://rpc-mainnet.maticvigil.com/v1/${MATIC_PROJECT_ID}`],
    rpcUrls: ['https://rinkeby.infura.io/v3/bacc1dd2c9784005a73b98c1a39ae00d'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    metamaskAddable: true
  }, 
  [ChainId.AVAX]: {
    chainId: `0x${ChainId.AVAX.toString(16)}`,
    chainName: 'AVALANCHE C-CHAIN',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io'],
    metamaskAddable: true
  }
}
