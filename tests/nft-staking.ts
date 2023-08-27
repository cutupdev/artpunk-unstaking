import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NftStaking } from "../target/types/nft_staking";

describe("nft-staking", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.nft_staking as Program<NftStaking>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
