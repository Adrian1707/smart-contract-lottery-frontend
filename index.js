import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

// let enableVotesCount = false
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const voteToWithdrawButton = document.getElementById("withdrawButton")
// const withdrawVotes = document.getElementById("withdrawVotes").innerHTML = await withdrawVotesCount()
const LOTTERY_TICKET_PRICE_ETH = '1.0'

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
voteToWithdrawButton.onclick = voteToWithdraw

async function connect(){
  await ethereum.request({ method: 'eth_requestAccounts' })
  connectButton.innerHTML="Disconnect"
}

// async function withdrawVotesCount() {
//   if(enableVotesCount) {
//     console.log(window.ethereum)
//     const contract = await getContract()
//     console.log(contract)
//     const votersLength = await contract.getVotersLength()
//     console.log(votersLength)
//     return votersLength
//   } else {
//     return "Fund to see count"
//   }
// }

async function getBalance() {
  const provider = getProvider()
  const balance = await provider.getBalance(contractAddress)
  alert(`Potential winnings are: ${ethers.utils.formatEther(balance)} ETH`)
}

async function getContract() {
  const provider = getProvider()
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, abi, signer)
}

function getProvider() {
  return new ethers.providers.Web3Provider(window.ethereum)
}

async function fund() {
  const provider = getProvider()
  const contract = await getContract()
  try {
    const transactionResponse = await contract.fund({value: ethers.utils.parseEther(LOTTERY_TICKET_PRICE_ETH)})
    await listenForTransactionMine(transactionResponse, provider)
    // enableVotesCount = true
    console.log("Done")
  } catch(error) {
    alert("Funding cancelled")
    console.log(error)
  }
}

async function voteToWithdraw() {
  const provider = getProvider()
  const contract = await getContract()
  try {
    const transactionResponse = await contract.voteToWithdraw()
    await listenForTransactionMine(transactionResponse, provider)
    console.log("Vote complete")
  } catch(error) {
    alert("Vote cancelled")
    console.log(error)
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.confirmations}`)
      resolve()
    })
  })
}
