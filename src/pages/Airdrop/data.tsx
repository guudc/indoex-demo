import { revalidate } from '../../api'
import { getSimpleProtocolsPageData } from '../../api/protocols'
import { basicPropertiesToKeep } from '../../api/protocols/utils'

const exclude = [
  'DeerFi',
  'FireDAO',
  'Robo-Advisor for Yield',
  'SenpaiSwap',
  'Zunami Protocol',
  'NowSwap',
  'NeoBurger',
  'MochiFi',
  'StakeHound',
  'Mento',
  'Lightning Network',
  'Secret Bridge',
  'Karura Swap',
  'Karura Liquid-Staking',
  'Karura Dollar (kUSD)',
  'Tezos Liquidity Baking',
  'Notional',
  'Tinlake',
  'Kuu Finance'
]

export async function getStaticProps() {
  const protocolsRaw = await getSimpleProtocolsPageData([...basicPropertiesToKeep, 'extraTvl', 'listedAt', 'chainTvls'])

  const protocols = protocolsRaw.protocols
    .filter(token => (token.symbol === null || token.symbol === '-') && !exclude.includes(token.name))
    .map(p => ({ listedAt: 1624728920, ...p }))
    .sort((a, b) => b.listedAt - a.listedAt)
  const airdrops = protocols.map(protocol => protocol)
  // console.log('airdrops: ', airdrops)
  // setState({ ...state, airdrops: [...airdrops] })

  return {
    props: {
      airdrops,
      chainList: protocolsRaw.chains
    },
    revalidate: revalidate()
  }
}
