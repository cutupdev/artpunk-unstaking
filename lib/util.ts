
import * as anchor from "@project-serum/anchor";
import {
    PublicKey,
} from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const METAPLEX = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const MPL_DEFAULT_RULE_SET = new PublicKey(
    "AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5"
);

const getAssociatedTokenAccount = async (
    ownerPubkey: PublicKey,
    mintPk: PublicKey
): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (PublicKey.findProgramAddressSync(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];

    return associatedTokenAccountPubkey;
}

const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
    return (
        await PublicKey.findProgramAddress([Buffer.from('metadata'), METAPLEX.toBuffer(), mint.toBuffer()], METAPLEX)
    )[0];
};

const getMasterEdition = async (
    mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
    return (
        await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                METAPLEX.toBuffer(),
                mint.toBuffer(),
                Buffer.from("edition"),
            ],
            METAPLEX
        )
    )[0];
};

const findTokenRecordPda = async (
    mint: PublicKey,
    token: PublicKey
): Promise<anchor.web3.PublicKey> => {
    return (
        await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                METAPLEX.toBuffer(),
                mint.toBuffer(),
                Buffer.from("token_record"),
                token.toBuffer(),
            ],
            METAPLEX
        )
    )[0];
}

export {
    getAssociatedTokenAccount,
    getMasterEdition,
    getMetadata,
    findTokenRecordPda
}
