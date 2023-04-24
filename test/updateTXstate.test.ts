//本地Aaas交易测试
import './aa.init'
import { BigNumber, Event, Wallet } from 'ethers'
import { expect } from 'chai'
import {
  EntryPoint,
  SimpleAccount,
  SimpleAccountFactory,
  
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
    let Account: SimpleAccount
  
    let accountOwner: Wallet
    const ethersSigner = ethers.provider.getSigner()



describe('#generate account address and initcode', () => {
     it('generate account address and initcode', async () => {
       
      //let address2=await ethersSigner.getAddress();
      const [address1, address2] = await ethers.getSigners();
      // let banlance=await ethers.provider.getBalance(address1);
      // let banlance2=await ethers.provider.getBalance(address2);
      let banlance=await address1.getBalance();
     // let banlance2=await address2.getBalance();
      console.log(" address1=",address1.address)
      console.log(" banlance=",banlance)
      console.log(" address2=",address2.address)
      let banlance2=await address2.getBalance();
      console.log(" banlance2=",banlance2)
     //实例化入口点合约
      let entryPoint_factory= await ethers.getContractFactory("EntryPoint")
      entryPoint=await entryPoint_factory.attach('0x7319251457AaaF77a3823734Fad774d3dc3Ba728');
      
      //let balance=await entryPoint.balanceOf("0x7c6BC3c288065CddDCa1877ea66a6E923E8356D3")
      console.log("entrypoint address=",entryPoint.address)
      
     //实例化SimpleAccount合约
      let simpleAccount_factor=await ethers.getContractFactory("SimpleAccount")
      Account=await simpleAccount_factor.attach('0x72B0D6FA5DbAAE49feED0d38A085aDB4DB2fD2B7');
      //获得交易序列号
      let seqNum=await Account.SequenceNumber(address1.address)
        console.log("seqNum=",seqNum)
     //从账户合约读取交易信息
      let befor_txInfo = await Account.TxsInfo(address1.address,seqNum)
      console.log("before update txInfo.state=",befor_txInfo.state)

      //实例化TxSTate合约
      let txState_factory=await ethers.getContractFactory("TxState")
      let txState=await txState_factory.attach('0x35E342b13835cf928f7e4D1705077b58A9c8556c');
        
      //更新交易状态
        await txState.setL1TxState('0x1234567812345678123456781234567812345678123456781234567812345678',Account.address,address1.address, seqNum,1)
  
      
      //获取交易哈希
     let txHash=await Account.getL1Txhash(address1.address,seqNum)

     //从账户合约读取交易信息
     let txInfo = await Account.TxsInfo(address1.address,seqNum)
     console.log("txInfo=",txInfo)
      }
      )
    
     

})
})