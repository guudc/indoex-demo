import React, { useCallback } from 'react'
import { ChainId } from 'dxswap-sdk'
import { NETWORK_DETAIL } from '../../constants'
import { Box, Flex, Text } from 'rebass'
import { ButtonPrimary } from '../Button'
import styled from 'styled-components'
import Web3 from 'web3';

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
`

export default function NewNetworkPopup({ chainId }: { chainId: ChainId }) {
  const handleAddClick = useCallback(async () => {
    if (!window.ethereum || !window.ethereum.request) return
    //first try switching over before adding
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex(chainId) }],
      });
    } 
    catch (switchError) {
      window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [{ ...NETWORK_DETAIL[chainId], metamaskAddable: undefined }]
      })
      .catch(error => {
        console.error(`error adding network to metamask`, error)
      })
    }
    
  }, [chainId])

  return (
    <Flex flexDirection="column">
      <Box mb="16px">Do you want to switch over to {NETWORK_DETAIL[chainId].chainName} </Box>
      <Flex justifyContent="flex-end" width="100%">
        <Box>
          <ResponsiveButtonPrimary padding="8px 14px" onClick={handleAddClick}>
            <Text fontWeight={700} fontSize={12}>
              SWITCH NETWORK
            </Text>
          </ResponsiveButtonPrimary>
        </Box>
      </Flex>
    </Flex>
  )
}
