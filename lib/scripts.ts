import * as anchor from '@project-serum/anchor';
import {
    PublicKey,
    Keypair,
    SystemProgram,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    Transaction,
    Connection,
    ComputeBudgetProgram,
} from '@solana/web3.js';

import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PROGRAM_ID as TOKEN_AUTH_RULES_ID } from "@metaplex-foundation/mpl-token-auth-rules";

import { METAPLEX, MPL_DEFAULT_RULE_SET, findTokenRecordPda, getAssociatedTokenAccount, getMasterEdition, getMetadata } from './util';

const POOL_SEEDS = 'POOL';
const POOL_SIGNER_SEEDS = 'POOL SIGNER';
const ARTE_VAULT_SEEDS = 'ARTE staking vault';
const POOL_DATA_SEEDS = 'DATA OF ART STAKING';


export const createUnlockPnftTx = async (
    userAddress: PublicKey,
    mint: PublicKey,
    program: anchor.Program,
    connection: Connection
) => {

    let [pool, nonce_pool] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(POOL_SEEDS), userAddress.toBuffer(), mint.toBuffer()],
        program.programId
    );

    let [poolSigner, _nonceSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(POOL_SIGNER_SEEDS), userAddress.toBuffer()],
        program.programId
    );

    let [vault, _nonceVault] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(ARTE_VAULT_SEEDS)],
        program.programId
    );

    let [poolData, _nonceData] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(POOL_DATA_SEEDS)],
        program.programId
    );

    console.log("mint: ", mint.toBase58());
    console.log("poolSigner: ", poolSigner.toBase58());

    const mintMetadata = await getMetadata(mint);
    const nftEdition = await getMasterEdition(mint);

    const largestAccounts = await connection.getTokenLargestAccounts(
        new PublicKey(mint)
    );
    const tokenAccount = largestAccounts.value[0].address;
    console.log("tokenAccount: ", tokenAccount.toBase58());

    const destTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
    console.log("destTokenAccount: ", destTokenAccount.toBase58());

    const tokenMintRecord = await findTokenRecordPda(mint, tokenAccount);
    const userTokenRecord = await findTokenRecordPda(mint, destTokenAccount);

    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1000000
    });

    const tx = new Transaction();

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1
    });
    tx.add(modifyComputeUnits);
    tx.add(addPriorityFee);

    const txId = await program.methods
        .unlockPnft(_nonceSigner, _nonceVault)
        .accounts({
            pool,
            poolSigner,
            user: userAddress,
            mint: mint,
            vault: vault,
            data: poolData,
            nftFrom: tokenAccount,
            nftTo: destTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            mintMetadata,
            mintEdition: nftEdition,
            poolTokenRecord: tokenMintRecord,
            userTokenRecord: userTokenRecord,
            authorizationRules: MPL_DEFAULT_RULE_SET,
            mplTokenAuthRulesProgram: TOKEN_AUTH_RULES_ID,
            tokenMetadataProgram: METAPLEX,
            tokenAtaProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            sysvarInstruction: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .transaction();

    tx.add(txId);

    return tx;
}
