// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable reason-string */
/* solhint-disable no-inline-assembly */

import "../core/BasePaymaster.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "../interfaces/IAccountList.sol";
/**
 * A sample paymaster that uses external service to decide whether to pay for the UserOp.
 * The paymaster trusts an external signer to sign the transaction.
 * The calling user must pass the UserOp to that external signer first, which performs
 * whatever off-chain verification before signing the UserOp.
 * Note that this signature is NOT a replacement for the account-specific signature:
 * - the paymaster checks a signature to agree to PAY for GAS.
 * - the account checks a signature to prove identity and account ownership.
 */
//Paymaster中验证算法：
//验证验证该FIDO是否已经创建过账户合约，如果未创建过验证通过，否则验证失败
//采取这种方法有两个好处：
//1.由于FIDO公钥的生成需要一定的硬件和人力成本，这种验证方式可以防止大规模的DOS攻击
//2.整个账户合约创建过程无需后端的信任，增加系统的去中心化程度

contract AaasCreationPaymaster is BasePaymaster {

    using ECDSA for bytes32;
    using UserOperationLib for UserOperation;
   
   uint256 public constant maxRequiredPreFund = 0.005 ether;

   // IAccountList private immutable _accountList;

    uint256 private constant VALID_TIMESTAMP_OFFSET = 20;

    uint256 private constant FINAL_OFFSET = 84;

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint){
        _entryPoint;
    }


    mapping(address => bool) public senderVerify; //由于在入口点合约里已经限制了FIDO只能创建一个账户合约，所以这里只需要判断所需创建的Sender是否有资格被资助（即是否已经利用过这个paymaster）
    
    function pack(UserOperation calldata userOp) internal pure returns (bytes memory ret) {
        // lighter signature scheme. must match UserOp.ts#packUserOp
        bytes calldata pnd = userOp.paymasterAndData;
        // copy directly the userOp from calldata up to (but not including) the paymasterAndData.
        // this encoding depends on the ABI encoding of calldata, but is much lighter to copy
        // than referencing each field separately.
        assembly {
            let ofs := userOp
            let len := sub(sub(pnd.offset, ofs), 32)
            ret := mload(0x40)
            mstore(0x40, add(ret, add(len, 32)))
            mstore(ret, len)
            calldatacopy(add(ret, 32), ofs, len)
        }
    }
    function getentryPoint() public view virtual  returns (IEntryPoint) {
        return entryPoint;
    }
    /**
     * return the hash we're going to sign off-chain (and validate on-chain)
     * this method is called by the off-chain service, to sign the request.
     * it is called on-chain from the validatePaymasterUserOp, to validate the signature.
     * note that this signature covers all fields of the UserOperation, except the "paymasterAndData",
     * which will carry the signature itself.
     */
    function getHash(UserOperation calldata userOp, uint48 validUntil, uint48 validAfter)
    public view returns (bytes32) {
        //can't use userOp.hash(), since it contains also the paymasterAndData itself.

        return keccak256(abi.encode(
                pack(userOp),
                block.chainid,
                address(this),
                
                validUntil,
                validAfter
            ));
    }
   error Failed(bool a);
    /**
     * verify our external signer signed this request.
     * the "paymasterAndData" is expected to be the paymaster and a signature over the entire request params
     * paymasterAndData[:20] : address(this)
     * paymasterAndData[20:84] : abi.encode(validUntil, validAfter)
     * paymasterAndData[84:] : signature
     */
    function _validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 requiredPreFund)
    internal  override returns (bytes memory context, uint256 validationData) {
    (uint48 validUntil, uint48 validAfter) = parsePaymasterAndData(userOp.paymasterAndData);
    //revert Failed(true) ;
     if(userOpHash==keccak256(abi.encode(userOp.hash(),address(getentryPoint()), block.chainid))){
        bool helped=senderVerify[userOp.sender];
        if(!helped)
        {
        if(requiredPreFund<=maxRequiredPreFund)
        {
            senderVerify[userOp.sender]=true;
            //false为验证成功
           
           return ("",_packValidationData(false,validUntil,validAfter));
        }
        }
           //true为验证失败
        return ("",_packValidationData(true,validUntil,validAfter));
    }
}
      function parsePaymasterAndData(bytes calldata paymasterAndData) public pure returns(uint48 validUntil, uint48 validAfter) {
        (validUntil, validAfter) = abi.decode(paymasterAndData[VALID_TIMESTAMP_OFFSET:FINAL_OFFSET],(uint48, uint48));
        //signature = paymasterAndData[SIGNATURE_OFFSET:];
    }


 
}
