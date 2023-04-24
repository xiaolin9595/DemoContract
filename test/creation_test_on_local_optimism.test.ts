//在Aaas L2节点上测试账户创建
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
  TestRevertAccount__factory,

  TestSignatureAggregator,
  TestSignatureAggregator__factory,
  MaliciousAccount__factory,
  TestWarmColdAccount__factory,
  AccountList
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
  simulationResultWithAggregationCatch,
  createAccountOwner_Aaas
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
    let acccountlist :AccountList
    let accountOwner: Wallet
    const ethersSigner = ethers.provider.getSigner()
    let account: SimpleAccount
  
   



describe('#generate account address and initcode', () => {
     it('generate account address and initcode', async () => {
        //accountOwner=await createAccountOwner_Aaas("4d3f5035f1fbcf9fc0f08f6ffae023dc622218d264369c7c43b79833464f72a9");
        //let balance=await accountOwner.getBalance();
        //console.log(" banlance=",balance)
    
      let entryPoint_factory= await ethers.getContractFactory("EntryPoint")
      entryPoint=await entryPoint_factory.deploy();
      
      console.log("entrypoint address=",entryPoint.address)
      //获取Account list地址 
      let address_list_aadress= await entryPoint.accountList()
      console.log("accountList address=",address_list_aadress)
      //创建Txstate合约
      let txState_factory= await ethers.getContractFactory("TxState")
      let txState=await txState_factory.deploy(entryPoint.address);
      console.log("txState address=",txState.address)
      //创建accountFactory合约
      let simpleAccountFactory_factory= await ethers.getContractFactory("SimpleAccountFactory")
      simpleAccountFactory=await simpleAccountFactory_factory.deploy(entryPoint.address,txState.address);
      
      const salt = 40
      console.log("simpleAccountFactory:",simpleAccountFactory.address)
      const  fidoPubKey1:BytesLike ="0x4554480000000000000000000000000000000000000000000000000000000000";
      let  preAddr=await simpleAccountFactory.getAddress(fidoPubKey1,salt)
      console.log("%s",fidoPubKey1)
    

      let trans= await accountOwner.populateTransaction({
        to: preAddr ,
        value: parseEther('1')
      });

      let rec=await accountOwner.sendTransaction(trans)

      let banlance0=await getBalance(preAddr)
      console.log("banlance0=",banlance0)
      let initCode: BytesLike
       preAddr = await getAccountAddress(fidoPubKey1, simpleAccountFactory, salt)
      console.log("new account address:",preAddr)

      initCode= getAccountInitCode(fidoPubKey1, simpleAccountFactory,salt)
      
      console.log("initCode:",initCode)
      
      const userOp = await fillAndSign({
        sender: preAddr,
        initCode:initCode,
        fidoPubKey:fidoPubKey1,
        signature:'0x'
        
      }, ethersSigner, entryPoint)
      console.log("userOp:",userOp)
      
      const recp = await entryPoint.handleOps([userOp], accountOwner.address, {
        maxFeePerGas: 1e9,
        gasLimit: 1e7
      }).then(async t => await t.wait())
      console.log('rcpt.gasUsed=', recp.gasUsed.toString())
      let accountlist_fatory= await ethers.getContractFactory("AccountList")
      acccountlist=await accountlist_fatory.attach(address_list_aadress)
      let sender=await acccountlist.Get(fidoPubKey1)
      console.log("从Account list中获取的新创建的账户合约地址为：",sender)
    
    //测试交易流程
      let simpleAccount_factory=await ethers.getContractFactory("SimpleAccount")
      let simpleAccount        =await simpleAccount_factory.attach(preAddr);
      let banlance_simpleaccount_pre=await ethers.provider.getBalance(preAddr);
      console.log("banlance_simpleaccount_pre=",banlance_simpleaccount_pre)
      const callData = simpleAccount.interface.encodeFunctionData('execute', [accountOwner.address, parseEther('0.5'), '0x'])
     
      //生成useroperation
      const userOp_transfer = await fillAndSign({
        sender: preAddr,
        callData,
        fidoPubKey: fidoPubKey1,
      }, accountOwner, entryPoint)
      //执行Useroperation
      const rcpt = await entryPoint.handleOps([userOp_transfer], accountOwner.address, {
        maxFeePerGas: 1e9,
        gasLimit: 1e7
      }).then(async t => await t.wait())
      console.log('rcpt.gasUsed=', rcpt.gasUsed.toString())
      let banlance_simpleaccount_aft=await ethers.provider.getBalance(preAddr);
      console.log("banlance_simpleaccount_aft=",banlance_simpleaccount_aft)

      }
      )
    


})
})