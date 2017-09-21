pragma solidity ^0.4.11;

contract Escrow{

  struct transaction{
    uint amount;
    uint deadline;
    bool accepted;
    bool senderCanWithdraw;
    bool receiverCanWithdraw;
    bool finalized;
  }

  mapping (address => mapping(address => transaction)) public transactions;

  function Escrow(){}

  function makeTransaction(address receiver, uint deadline) payable {
    require(!transactions[msg.sender][receiver].accepted && msg.value != 0
            && transactions[msg.sender][receiver].amount == 0);

    transactions[msg.sender][receiver].amount = msg.value;
    transactions[msg.sender][receiver].deadline = deadline;
    transactions[msg.sender][receiver].accepted = false;
    transactions[msg.sender][receiver].senderCanWithdraw = true;
    transactions[msg.sender][receiver].receiverCanWithdraw = false;
    transactions[msg.sender][receiver].finalized = false;
  }

  function acceptTransaction(address sender) {
    require(!transactions[sender][msg.sender].accepted);

    transactions[sender][msg.sender].accepted = true;
    transactions[sender][msg.sender].senderCanWithdraw = false;
    transactions[sender][msg.sender].deadline = now + (transactions[sender][msg.sender].deadline * 1 days);
  }

  function receiverWithdrawal(address sender) {
    require((transactions[sender][msg.sender].receiverCanWithdraw) ||
    ((now > transactions[sender][msg.sender].deadline) && (transactions[sender][msg.sender].accepted)));

    uint amount = transactions[sender][msg.sender].amount;
    transactions[sender][msg.sender].amount = 0;
    transactions[sender][msg.sender].accepted = false;
    transactions[sender][msg.sender].deadline = 0;

    msg.sender.transfer(amount);
  }

  function senderWithdrawal(address receiver) {
    require((transactions[msg.sender][receiver].senderCanWithdraw));

    uint amount = transactions[msg.sender][receiver].amount;
    transactions[msg.sender][receiver].amount = 0;
    transactions[msg.sender][receiver].deadline = 0;

    msg.sender.transfer(amount);
    }

  function finalizeTransaction(address receiver) {
    require(!transactions[msg.sender][receiver].finalized);

    transactions[msg.sender][receiver].receiverCanWithdraw = true;
    transactions[msg.sender][receiver].finalized = true;
  }

  function refundTransaction(address sender) {
    require(transactions[sender][msg.sender].accepted);

    transactions[sender][msg.sender].senderCanWithdraw = true;
  }

  function disputeTransaction(address receiver, uint addedTime) {
    require(now <= transactions[msg.sender][receiver].deadline && !transactions[msg.sender][receiver].receiverCanWithdraw);

    transactions[msg.sender][receiver].deadline += (addedTime * 1 days);
  }

  function getSentTransactionData(address receiver) constant returns(uint amount,
                                                                     uint deadline,
                                                                     bool accepted,
                                                                     bool senderWithdrawl){
    return(
      transactions[msg.sender][receiver].amount,
      transactions[msg.sender][receiver].deadline,
      transactions[msg.sender][receiver].accepted,
      transactions[msg.sender][receiver].senderCanWithdraw
      );
  }

  function getRecTransactionData(address sender) constant returns(uint amount,
                                                                  uint deadline,
                                                                  bool accepted,
                                                                  bool receiverCanWithdraw){
    return(
      transactions[sender][msg.sender].amount,
      transactions[sender][msg.sender].deadline,
      transactions[sender][msg.sender].accepted,
      transactions[sender][msg.sender].receiverCanWithdraw
      );
  }

  function (){
    throw;
  }
}
