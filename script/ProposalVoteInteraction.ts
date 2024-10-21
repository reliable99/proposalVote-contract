import hre from "hardhat";

async function main (){
    const DEPLOYED_CONTRACT = "0xD9c1DBA718CAFc9fB24df3e888E23A17120F8F56";
  
    const myAccount = "0x6Db7892358cc6dFeaD64FD7dCe277AE003461a4E";


    const signer = await hre.ethers.getSigner(myAccount);
   

    const ProposalVoteContractInstance = await hre.ethers.getContractAt(
        "ProposalVote",
        DEPLOYED_CONTRACT
    );

     // starting scripting

     console.log("##################### Creating Proposals ###############");

     const proposalName1 = "Charity";
    const propasalDescription1 = "Donate money for charity";
    const quorum1 = 2;

    const proposalName2 = "Salary";
    const propasalDescription2 = "increament in salary";
    const quorum2 = 2;


     const createProposal1 = await ProposalVoteContractInstance.connect(signer).createProposal(proposalName1, propasalDescription1, quorum1);

     createProposal1.wait();
     console.log({"Proposal 1": createProposal1});

     const createProposal2 = await ProposalVoteContractInstance.connect(signer).createProposal(proposalName2, propasalDescription2, quorum2);

     createProposal2.wait();
     console.log({"Proposal 2": createProposal2});


     console.log("##################### Voting on Proposal ###############");

     const voteOnProposal1 = await ProposalVoteContractInstance.connect(signer).voteOnProposal(0);

     voteOnProposal1.wait();
     console.log({"voted on propsal 1": voteOnProposal1});


     console.log("##################### getting All Proposal ###############");

     const getAllTheProposal = await ProposalVoteContractInstance.getAllProposals();

     console.table(getAllTheProposal);

     console.log("##################### getting A Proposal ###############");

     const getSingleProposal = await ProposalVoteContractInstance.getProposal(0);

     console.log("Getting a single proposal", {
        name:getSingleProposal.name_,
        description: getSingleProposal.desc_,
        count:getSingleProposal.count_.toString(),
        voters:getSingleProposal.voters_,
        qourum:getSingleProposal.quorum_,
        staus:getSingleProposal.status_
        
        })
    


}

     






main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})