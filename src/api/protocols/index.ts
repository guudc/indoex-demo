import { PROTOCOLS_API } from './../../constants/index'

import { BasicPropsToKeep, formatProtocolsData } from './utils'

export const getProtocolsRaw = () => fetch(PROTOCOLS_API).then((r: any) => r.json())

// - used in /airdrops
export async function getSimpleProtocolsPageData(propsToKeep?: BasicPropsToKeep) {
  const { protocols, chains } = await getProtocolsRaw()

  const filteredProtocols = formatProtocolsData({
    protocols,
    protocolProps: propsToKeep
  })
  return { protocols: filteredProtocols, chains }
}
