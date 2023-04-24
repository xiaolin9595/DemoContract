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
    let simpleAccountFactory: SimpleAccountFactory
  
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
      //accountOwner = createAccountOwner();
      //console.log("woner address=",accountOwner.address)
      let entryPoint_factory= await ethers.getContractFactory("EntryPoint")
      entryPoint=await entryPoint_factory.deploy();

      //entryPoint=await entryPoint_factory.attach("0xba77eaa474c1b2c3ba1a754c6a765796a13ac3d8")
      //let balance=await entryPoint.balanceOf("0x7c6BC3c288065CddDCa1877ea66a6E923E8356D3")
      console.log("entrypoint address=",entryPoint.address)
     
      //获取account list的地址
      let address_list= await entryPoint.accountList()
      console.log("accountList address=",address_list)
      //console.log("entrypoint banlance=",balance)
     //创建Txstate合约
     let txState_factory= await ethers.getContractFactory("TxState")
     let txState=await txState_factory.deploy(entryPoint.address);
     console.log("txState address=",txState.address)
      let simpleAccountFactory_factory= await ethers.getContractFactory("SimpleAccountFactory")
      simpleAccountFactory=await simpleAccountFactory_factory.deploy(entryPoint.address,txState.address);
      //simpleAccountFactory=await simpleAccountFactory_factory.attach("0x6a61a1e3C1c329d01F909e7767760473D65C7170")
     
      const salt = 40
      console.log("simpleAccountFactory=",simpleAccountFactory.address)
      const  fidoPubKey1:BytesLike ="0x4554480000000000000000000000000000000000000000000000000000000000";
      let  preAddr=await simpleAccountFactory.getAddress(fidoPubKey1,salt)
      console.log("simpleaccount address=",preAddr)
      console.log("FidoPubKey:%s",fidoPubKey1)
      // let tx:Transaction{
            
      // }

      let trans= await address1.populateTransaction({
        to: preAddr ,
        value: parseEther('0.005')
      });

      let rec=await address1.sendTransaction(trans)
      //console.log("rec=",rec)
      let banlance0=await getBalance(preAddr)
      console.log("banlance0=",banlance0)
      let initCode: BytesLike
      initCode= getAccountInitCode(fidoPubKey1, simpleAccountFactory,salt)
    
      console.log("initCode:",initCode)
      
      const userOp = await fillAndSign({
        sender: preAddr,
        initCode:initCode,
        fidoPubKey:fidoPubKey1,
       
      }, ethersSigner, entryPoint)
      console.log("userOp:",userOp)
      
      const recp = await entryPoint.handleOps([userOp], address1.address, {
        maxFeePerGas: 1e9,
        gasLimit: 1e7
      }).then(async t => await t.wait())
      console.log('rcpt.gasUsed=', recp.gasUsed.toString())
      }
      )
    


})
})