use anchor_lang::prelude::*;

declare_id!("71UiqVYVUCfx9mgEWgTxY7XLaPkGGExx8mdFp6cNeWsh");

#[program]
pub mod my_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
