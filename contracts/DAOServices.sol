pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DAOServices is Ownable, Pausable {

    struct Transfer {
        address contract_;
        address to_;
        uint amount_;
        bool failed_;
    }
    mapping(address => uint[]) public transactionIndexesToSender;
    Transfer[] public transactions;
     
    mapping(bytes32 => address) public tokens;

    ERC20 public ERC20Interface;
     
    event TransferSuccessful(address indexed from_, address indexed to_, uint256 amount_);
    event TransferFailed(address indexed from_, address indexed to_, uint256 amount_);

    constructor() public {
        owner = msg.sender;
    }
     
    function addNewToken(bytes32 symbol_, address address_) public onlyOwner returns (bool) {
        tokens[symbol_] = address_;
        return true;
    }
    
    function removeToken(bytes32 symbol_) public onlyOwner returns (bool) {
        require(tokens[symbol_] != 0x0);
        delete(tokens[symbol_]);
        return true;
    }

    function transferTokens(bytes32 symbol_, address to_, uint256 amount_) public whenNotPaused{
        require(tokens[symbol_] != 0x0);
        require(amount_ > 0);

        address contract_ = tokens[symbol_];
        address from_ = msg.sender;

        ERC20Interface =  ERC20(contract_);

        uint256 transactionId = transactions.push(
            Transfer({
            contract_:  contract_,
            to_: to_,
            amount_: amount_,
            failed_: true
            })
        );

        transactionIndexesToSender[from_].push(transactionId - 1);

        if(amount_ > ERC20Interface.allowance(from_, address(this))) {
            emit TransferFailed(from_, to_, amount_);
            revert();
        }

        ERC20Interface.transferFrom(from_, to_, amount_);
        transactions[transactionId - 1].failed_ = false;
        emit TransferSuccessful(from_, to_, amount_);
    }

}