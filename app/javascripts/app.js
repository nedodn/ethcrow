// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import escrow_artifacts from '../../build/contracts/Escrow.json'

// Escrow is our usable abstraction, which we'll use through the code below.
var Escrow = contract(escrow_artifacts);

window.makeTransaction = function(){
  let receiver = $("#receiver").val();
  let amount = $("#amount").val();
  let days = $("#deadline").val();

  Escrow.deployed().then(function(contractInstance){
    contractInstance.makeTransaction(receiver, days, {value: web3.toWei(amount, 'ether'), from: web3.eth.accounts[0]}).then(function(v){
      if(v){
        $("#transMsg").html("<h3>Success</h3>");
      }
    });
  });
}

window.checkSentTransaction = function(){
  let receiver = $("#checkSent").val();

  Escrow.deployed().then(function(contractInstance){
    contractInstance.getSentTransactionData.call(receiver, {from: web3.eth.accounts[0]}).then(function(v){
      let amount = parseFloat(v[0].toString());

      if(amount === 0){
        $("#tableSent").hide();
        $("#sendMsg").show();
        $("#sendMsg").text("No Transaction Found");
        return;
      }
      else{
        $("#sendMsg").hide();
        $("#tableSent").show();
      }

      let deadline = parseFloat(v[1].toString());

      $("#tableAmount").text(web3.fromWei(amount,"ether"));
      if(v[2]){
        $("#tableAccepted").text("Accepted");
        $("#tableFinalize").html("<a href='#' onclick='finalize()' class='btn btn-default'>Finalize</a>");

        let date = new Date(deadline * 1000);

        let dateString = "";

        dateString += (date.getMonth() + 1) + "/";
        dateString += date.getDate() + "/";
        dateString += date.getFullYear() + " ";
        dateString += date.getHours() + ":";
        dateString += date.getMinutes();

        $("#tableDeadline").text(dateString);
        $("#tableDispute").html("<a href='#' onclick='dispute()' class='btn btn-default'>Dispute</a><br><input type='number' id='addDispute' placeholder='Days' style='width:75px'>");
      }
      else{
        $("#tableAccepted").text("Not Accepted");
        $("#tableDeadline").text(deadline + " day(s)");
        $("#tableFinalize").text("Not Accepted");
        $("#tableDispute").text("Not Accepted");
      }

      if(v[3]){
        $("#tableWithdrawal").html("<a href='#' onclick='senderWithdrawal()' class='btn btn-default'>Withdraw</a>");
      }
      else{
        $("#tableWithdrawal").text("Cannot Withdrawal");
      }
    $("#tableAddress").text(receiver);
  });
});
}


window.checkRecTransaction = function(){
  let sender = $("#checkRec").val();

  Escrow.deployed().then(function(contractInstance){
    contractInstance.getRecTransactionData.call(sender, {from: web3.eth.accounts[0]}).then(function(v){
      let amount = parseFloat(v[0].toString());
      if(amount === 0){
        $("#tableRec").hide();
        $("#recMsg").show();
        $("#recMsg").text("No Transaction Found");
        return;
      }
      else{
        $("#recMsg").hide();
        $("#tableRec").show();
      }
      let deadline = parseFloat(v[1].toString());

      $("#tableAmountR").html(web3.fromWei(amount,"ether"));

      if(v[2]){
        $("#tableAcceptedR").text("Accepted");

        let date = new Date(deadline * 1000);

        let dateString = "";

        dateString += (date.getMonth() + 1) + "/";
        dateString += date.getDate() + "/";
        dateString += date.getFullYear() + " ";
        dateString += date.getHours() + ":";
        dateString += date.getMinutes();

        $("#tableDeadlineR").text(dateString);
        $("#refund").html("<a href='#' onclick='refund()' class='btn btn-default'>Refund</a>");
        $("#refundH").show();
        $("#refund").show();
      }
      else{
        $("#tableAcceptedR").html("<a href='#' onclick='acceptTransaction()' class='btn btn-default'>Accept</a>");
        $("#tableDeadlineR").text(deadline + " day(s)");
        $("#refundH").hide();
        $("#refund").hide();
      }
      $("#tableWithdrawalR").html("<a href='#' onclick='recWithdrawal()' class='btn btn-default'>Withdraw</a>")

    $("#tableAddressR").text(sender);
  });
});
}

window.acceptTransaction = function(){
  let sender = $("#tableAddressR").html();

  Escrow.deployed().then(function(contractInstance){
    contractInstance.acceptTransaction(sender, {gas: 140000, from: web3.eth.accounts[0]}).then(function(){
    });
  });
}

window.recWithdrawal = function(){
  let sender = $("#tableAddressR").html();

  Escrow.deployed().then(function(contractInstance){
    contractInstance.receiverWithdrawal(sender, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v){
    });
  });
}

window.senderWithdrawal = function(){
  let receiver = $("#tableAddress").html();

  Escrow.deployed().then(function(contractInstance){
    contractInstance.senderWithdrawal(receiver, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v){
    });
  });
}

window.finalize = function(){
  let receiver = $("#tableAddress").html();

  Escrow.deployed().then(function(contractInstance){
    contractInstance.finalizeTransaction(receiver, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v){
    });
  });
}

window.dispute = function(){
  let receiver = $("#tableAddress").text();
  let days = $("#addDispute").val();

  Escrow.deployed().then(function(contractInstance){
    contractInstance.disputeTransaction(receiver,days, {gas:140000, from: web3.eth.accounts[0]}).then(function(v){
    });
  });
}

window.refund = function(){
  let sender = $("#tableAddressR").text();

  Escrow.deployed().then(function(contractInstance){
    contractInstance.refundTransaction(sender, {gas:140000, from: web3.eth.accounts[0]}).then(function(v){
    });
  });
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Escrow.setProvider(web3.currentProvider);
});
