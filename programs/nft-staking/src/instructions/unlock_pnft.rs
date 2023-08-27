use crate::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::instruction::builders::TransferBuilder;
use mpl_token_metadata::instruction::InstructionBuilder;
use mpl_token_metadata::instruction::TransferArgs;
use solana_program::entrypoint::ProgramResult;
use solana_program::program::invoke_signed;

#[derive(Accounts)]
pub struct UnlockPNFT<'info> {
    /// CHECK:
    #[account(mut)]
    pub pool: AccountInfo<'info>,
    /// CHECK:
    #[account(mut)]
    pub pool_signer: AccountInfo<'info>,
    /// CHECK:
    #[account(mut)]
    pub user: Signer<'info>,
    pub mint: Box<Account<'info, Mint>>,
    /// CHECK:
    pub vault: AccountInfo<'info>,
    /// CHECK:
    pub data: AccountInfo<'info>,

    #[account(mut)]
    pub nft_from: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub nft_to: Box<Account<'info, TokenAccount>>,
    pub token_program: Program<'info, Token>,

    #[account(
        mut,
        seeds = [b"metadata", &mpl_token_metadata::ID.as_ref(), (*mint.to_account_info().key).as_ref()],
        seeds::program = &mpl_token_metadata::ID,
        bump,
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint_metadata: Box<Account<'info, TokenMetadata>>,

    #[account(
        mut,
        seeds = [b"metadata", &mpl_token_metadata::ID.as_ref(), (*mint.to_account_info().key).as_ref(), b"edition"],
        seeds::program = &mpl_token_metadata::ID,
        bump,
    )]
    pub mint_edition: Box<Account<'info, MasterEdition>>,

    #[account(
        mut,
        constraint = pool_token_record.owner == &mpl_token_metadata::ID
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub pool_token_record: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub user_token_record: AccountInfo<'info>,

    #[account(
        mut,
        constraint = authorization_rules.owner == &mpl_token_auth_rules::ID
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub authorization_rules: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mpl_token_auth_rules_program: AccountInfo<'info>,
    pub token_metadata_program: Program<'info, MplTokenMetadata>,

    pub token_ata_program: Program<'info, AssociatedToken>,
    // These are system and rent
    pub system_program: Program<'info, System>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub sysvar_instruction: AccountInfo<'info>,
}

pub fn unlock_pnft_handler(
    ctx: Context<UnlockPNFT>,
    _nonce_signer: u8,
    _nonce_vault: u8,
) -> Result<()> {
    let pool_signer = &ctx.accounts.pool_signer;

    let (stake_pda, _bump) = Pubkey::find_program_address(
        &[ESCROW_PDA_SEED.as_ref(), ctx.accounts.user.key.as_ref()],
        ctx.program_id,
    );

    msg!("stake pda: {}", stake_pda.key());
    msg!("bump: {}", _bump);

    require!(
        stake_pda == pool_signer.key(),
        StakingError::AuthorityInvalid
    );

    let args = TransferArgs::V1 {
        amount: 1,
        authorization_data: None,
    };

    let seeds = &[
        ESCROW_PDA_SEED.as_ref(),
        ctx.accounts.user.key.as_ref(),
        &[_bump],
    ];
    let signer = &[&seeds[..]];

    transfer_pnft_with_signer(
        ctx.accounts.nft_from.to_account_info(),
        pool_signer.to_account_info(),
        ctx.accounts.nft_to.to_account_info(),
        ctx.accounts.user.to_account_info().clone(),
        ctx.accounts.user.to_account_info().clone(),
        ctx.accounts.pool_signer.to_account_info().clone(),
        ctx.accounts.mint.to_account_info(),
        ctx.accounts.mint_metadata.to_account_info(),
        ctx.accounts.mint_edition.to_account_info(),
        ctx.accounts.pool_token_record.to_account_info(),
        ctx.accounts.user_token_record.to_account_info(),
        ctx.accounts.authorization_rules.to_account_info(),
        ctx.accounts.mpl_token_auth_rules_program.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.token_metadata_program.to_account_info(),
        ctx.accounts.token_ata_program.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        ctx.accounts.sysvar_instruction.to_account_info(),
        args,
        signer,
    )?;

    Ok(())
}

// Same transfer pnft utility just using program sign
// Able to use transfer from PDA to wallet
pub fn transfer_pnft_with_signer<'a>(
    source_token: AccountInfo<'a>,
    source_owner: AccountInfo<'a>,
    destination_token: AccountInfo<'a>,
    destination_owner: AccountInfo<'a>,
    payer: AccountInfo<'a>,
    authority: AccountInfo<'a>,
    mint: AccountInfo<'a>,
    metadata: AccountInfo<'a>,
    edition: AccountInfo<'a>,
    owner_token_record: AccountInfo<'a>,
    destination_token_record: AccountInfo<'a>,
    authorization_rules: AccountInfo<'a>,
    authorization_rules_program: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    token_metadata_program: AccountInfo<'a>,
    token_ata_program: AccountInfo<'a>,
    system_program: AccountInfo<'a>,
    sysvar_ins_program: AccountInfo<'a>,
    args: TransferArgs,
    signers_seed: &[&[&[u8]]; 1],
) -> ProgramResult {
    let mut builder = TransferBuilder::new();
    builder
        .token(source_token.key())
        .token_owner(source_owner.key())
        .destination(destination_token.key())
        .destination_owner(destination_owner.key())
        .mint(mint.key())
        .metadata(metadata.key())
        .edition(edition.key())
        .authority(authority.key())
        .payer(payer.key())
        .system_program(system_program.key())
        .sysvar_instructions(sysvar_ins_program.key())
        .spl_token_program(token_program.key())
        .spl_ata_program(token_ata_program.key())
        .authorization_rules_program(authorization_rules_program.key())
        .owner_token_record(owner_token_record.key())
        .destination_token_record(destination_token_record.key())
        .authorization_rules(authorization_rules.key());

    let transfer_ix = builder.build(args).unwrap().instruction();

    invoke_signed(
        &transfer_ix,
        &[
            source_token,
            source_owner,
            destination_token,
            destination_owner,
            mint,
            metadata,
            edition,
            owner_token_record,
            destination_token_record,
            authority,
            payer,
            system_program,
            sysvar_ins_program,
            token_program,
            token_ata_program,
            authorization_rules_program,
            authorization_rules,
            token_metadata_program,
        ],
        signers_seed,
    )
}
