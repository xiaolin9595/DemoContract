import './aa.init'
import { BigNumber, Event, Wallet } from 'ethers'
import { expect } from 'chai'
import {
  EntryPoint,
  SimpleAccount,
  SimpleAccountFactory,
  GasPrice,
  TestCounter,
  TestCounter__factory,
  TestExpirePaymaster,
  TestExpirePaymaster__factory,

  TestPaymasterAcceptAll,
  TestPaymasterAcceptAll__factory,
 

  TestSignatureAggregator,
  TestSignatureAggregator__factory,
 

} from '../typechain'
import {
  AddressZero,
  createAccountOwner,
  fund,
  checkForGeth,
  rethrow,
  tostr,
  getAccountInitCode,
  calcGasUsage,
  checkForBannedOps,
  ONE_ETH,
  TWO_ETH,
  deployEntryPoint,
  getBalance,
  createAddress,
  getAccountAddress,
  
  HashZero,
  simulationResultCatch,
  createAccount,
  getAggregatedAccountInitCode,
  simulationResultWithAggregationCatch
} from './testutils'
import { DefaultsForUserOp, fillAndSign, getUserOpHash,fillUserOpDefaults, fillUserOp } from './UserOp'
import { UserOperation } from './UserOperation'
import { PopulatedTransaction, Transaction } from 'ethers/lib/ethers'
import { ethers } from 'hardhat'
import { arrayify, defaultAbiCoder, hexConcat, hexZeroPad, parseEther, TransactionTypes } from 'ethers/lib/utils'
import { debugTransaction } from './debugTx'
import { BytesLike } from '@ethersproject/bytes'
import { toChecksumAddress } from 'ethereumjs-util'
import { signer } from '@thehubbleproject/bls'
import { bytes32 } from './solidityTypes'
import { Transform } from 'stream'

describe('EntryPoint', function () {
    let entryPoint: EntryPoint
    let simpleAccountFactory: SimpleAccountFactory
  
    let accountOwner: Wallet
    const ethersSigner = ethers.provider.getSigner()
    let GasPrice:GasPrice



describe('#generate account address and initcode', () => {
     it('generate account address and initcode', async () => {
       
      //let address2=await ethersSigner.getAddress();
      const [address1, address2] = await ethers.getSigners();
    
     
    
      let GasPrice_factory= await ethers.getContractFactory("GasPrice")
      GasPrice=await GasPrice_factory.deploy();

     
      console.log("GasPrice address=",GasPrice.address)
     
      await GasPrice.setGasPrice(1,1000000000)
      let gasPriceOf1=await GasPrice.getGasPrice(1)
      console.log("gasPriceOf1=",gasPriceOf1)
      expect(gasPriceOf1).to.equal(1000000000)
     
     
      
     
     
      }
      )
    


})
})