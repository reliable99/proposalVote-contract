import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ProposalVote", function () {
  async function deployProposalVoteFixture() {
    const [owner, otherAccount, voter1, voter2, voter3] =
      await hre.ethers.getSigners();

    const ProposalVote = await hre.ethers.getContractFactory("ProposalVote");
    const proposal = await ProposalVote.deploy();

    return { proposal, owner, otherAccount, voter1, voter2, voter3 };
  }

  it("Should be able to create proposal ", async function () {
    const { proposal, owner } = await loadFixture(deployProposalVoteFixture);
    const proposalName = "charity";
    const propasalDescription = "proposed that we should all donate 50k each";
    const quorum = 3;

    await proposal
      .connect(owner)
      .createProposal(proposalName, propasalDescription, quorum);

    const [
      proposalname,
      proposaldesc,
      votecount,
      voters,
      proposalquorum,
      status,
    ] = await proposal.getProposal(0);

    expect(proposalname).to.equal(proposalName);
    expect(proposaldesc).to.equal(propasalDescription);
    expect(votecount).to.equal(0);
    expect(voters.length).to.equal(0);
    expect(proposalquorum).to.equal(quorum);
    expect(status).to.equal(1);
  });

  it("Should be able to vote on  proposal ", async function () {
    const { proposal, owner, otherAccount } = await loadFixture(
      deployProposalVoteFixture
    );
    const proposalName1 = "Work leave ";
    const propasalDescription1 = "We should all agree to take a week leave";
    const quorum1 = 3;

    const proposalName2 = "Extend DltAfrica clossing hours";
    const propasalDescription2 = "Vote for time extension";
    const quorum2 = 3;

    await proposal
      .connect(owner)
      .createProposal(proposalName1, propasalDescription1, quorum1);
    await proposal
      .connect(owner)
      .createProposal(proposalName2, propasalDescription2, quorum2);

    await proposal.connect(otherAccount).voteOnProposal(0);

    const [
      proposalname,
      proposaldesc,
      votecount,
      voters,
      proposalquorum,
      status,
    ] = await proposal.getProposal(0);

    expect(proposalname).to.equal(proposalName1);
    expect(proposaldesc).to.equal(propasalDescription1);
    expect(votecount).to.equal(1);
    expect(voters.length).to.equal(1);
    expect(proposalquorum).to.equal(quorum1);
    expect(status).to.equal(2);
  });

  it("Voters should not be allowed to vote twice ", async function () {
    const { proposal, owner, otherAccount } = await loadFixture(
      deployProposalVoteFixture
    );
    const proposalName1 = "Charity";
    const propasalDescription1 = "proposed that we should all donate 50k each";
    const quorum1 = 3;

    const proposalName2 = "Extend DltAfrica clossing hours";
    const propasalDescription2 = "Vote for time extension";
    const quorum2 = 3;

    const proposalName3 = "Refreshment";
    const propasalDescription3 =
      "Meat pie and drinks for refreshment";
    const quorum3 = 4;

    await proposal
      .connect(owner)
      .createProposal(proposalName1, propasalDescription1, quorum1);
    await proposal
      .connect(owner)
      .createProposal(proposalName2, propasalDescription2, quorum2);

    await proposal
      .connect(owner)
      .createProposal(proposalName3, propasalDescription3, quorum3);

    await proposal.connect(otherAccount).voteOnProposal(2);

    await expect(
      proposal.connect(otherAccount).voteOnProposal(2)
    ).to.be.revertedWith("You have voted already");
  });

  it("Should  be able to approve proposal ", async function () {
    const { proposal, owner, otherAccount, voter1, voter2 } = await loadFixture(
      deployProposalVoteFixture
    );

    const proposalName = "Extend DltAfrica clossing hours";
    const propasalDescription =
      "Time extension";
    const quorum = 3;

    const proposalName2 = "Extend DltAfrica clossing hours";
    const propasalDescription2 =
      "Time extension";
    const quorum2 = 3;

    await proposal
      .connect(owner)
      .createProposal(proposalName, propasalDescription, quorum);
    await proposal
      .connect(owner)
      .createProposal(proposalName, propasalDescription, quorum);

    await proposal
      .connect(owner)
      .createProposal(proposalName2, propasalDescription2, quorum2);

    await proposal.connect(otherAccount).voteOnProposal(1);
    await proposal.connect(voter1).voteOnProposal(1);
    await proposal.connect(voter2).voteOnProposal(1);

    const [
      proposalname,
      proposaldesc,
      votecount,
      voters,
      proposalquorum,
      status,
    ] = await proposal.getProposal(1);

    expect(proposalname).to.equal(proposalName2);
    expect(proposaldesc).to.equal(propasalDescription2);
    expect(votecount).to.equal(3);
    expect(voters.length).to.equal(3);
    expect(proposalquorum).to.equal(quorum2);
    expect(status).to.equal(3);
  });

  it("Should not be able to vote on proposal if it is already passed", async function () {
    const { proposal, owner, otherAccount, voter1, voter2, voter3 } =
      await loadFixture(deployProposalVoteFixture);

    const proposalName = "Time extension";
    const propasalDescription =
      "Extend DltAfrica clossing hours";
    const quorum = 3;

    await proposal
      .connect(owner)
      .createProposal(proposalName, propasalDescription, quorum);

    await proposal.connect(otherAccount).voteOnProposal(0);
    await proposal.connect(voter1).voteOnProposal(0);
    await proposal.connect(voter2).voteOnProposal(0);

    await expect(proposal.connect(voter3).voteOnProposal(0)).to.be.revertedWith(
      "This proposal has been accepted already"
    );
  });

  it("Should  be able to get all proposal", async function () {
    const { proposal, owner } = await loadFixture(deployProposalVoteFixture);

    const proposalName1 = "Extend DltAfrica clossing hours";
    const propasalDescription1 =
      "Time extension";
    const quorum1 = 3;

    const proposalName2 = "Extra class";
    const propasalDescription2 = "Arrange extra class for web3 student";
    const quorum2 = 3;

    const proposalName3 = "Cairo language ";
    const propasalDescription3 = "kick start learning cairo immediately after solidity";
    const quorum3 = 3;

    await proposal
      .connect(owner)
      .createProposal(proposalName1, propasalDescription1, quorum1);

    await proposal
      .connect(owner)
      .createProposal(proposalName2, propasalDescription2, quorum2);

    await proposal
      .connect(owner)
      .createProposal(proposalName3, propasalDescription3, quorum3);

    const propos = await proposal.getAllProposals();

    expect(propos.length).to.equal(3);
    expect(propos[0]).to.deep.equal([
      proposalName1,
      propasalDescription1,
      0,
      [],
      quorum1,
      1,
    ]);
    expect(propos[1]).to.deep.equal([
      proposalName2,
      propasalDescription2,
      0,
      [],
      quorum2,
      1,
    ]);
    expect(propos[2]).to.deep.equal([
      proposalName3,
      propasalDescription3,
      0,
      [],
      quorum3,
      1,
    ]);
  });
  it("Should  be able to get a proposal", async function () {
    const { proposal, owner, otherAccount } = await loadFixture(
      deployProposalVoteFixture
    );

    const proposalName1 = "cairo Language";
    const propasalDescription1 =
     "kick start learning cairo immediately after solidity";
    const quorum1 = 3;

    await proposal
      .connect(owner)
      .createProposal(proposalName1, propasalDescription1, quorum1);

    const [
      proposalname,
      proposaldesc,
      votecount,
      voters,
      proposalquorum,
      status,
    ] = await proposal.getProposal(0);

    expect(proposalname).to.equal(proposalName1);
    expect(proposaldesc).to.equal(propasalDescription1);
    expect(votecount).to.equal(0);
    expect(voters.length).to.equal(0);
    expect(proposalquorum).to.equal(quorum1);
    expect(status).to.equal(1);
  });
});