use crate::*;

#[error_code]
pub enum StakingError {
    #[msg("Authority is invalid")]
    AuthorityInvalid,
    #[msg("Index out of range")]
    OutRange,
    #[msg("Invalid attribute")]
    InvalidAttribute,
    #[msg("Invalid token")]
    InvalidToken,
}
