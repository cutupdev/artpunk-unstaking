use anchor_lang::{prelude::*, AnchorDeserialize};

pub mod constant;
pub mod error;
pub mod instructions;
pub mod token_metadata;
use constant::*;
use error::*;
use instructions::*;
use token_metadata::*;

declare_id!("9KTTmg9ds35Lr2w7Jbq898c9qx4rdES3Qx7EnfCNWjKu");

#[program]
pub mod nft_staking {
    use super::*;

    pub fn unlock_pnft(
        ctx: Context<UnlockPNFT>,
        _nonce_signer: u8,
        _nonce_vault: u8,
    ) -> Result<()> {
        unlock_pnft::unlock_pnft_handler(ctx, _nonce_signer, _nonce_vault)
    }
}
