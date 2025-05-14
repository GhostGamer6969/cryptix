use anchor_lang::prelude::*;

declare_id!("6qrkjKfD3zALj1ANfKdmz1wP8688xZvsC5R8R5H2bz56");

#[program]
pub mod version3 {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>, masterhash: Pubkey) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.masterhash = masterhash;
        Ok(())
    }

    pub fn add_vault_entry(
        ctx: Context<AddVaultEntry>,
        masterhash: Pubkey,
        _entry_index: u64,
        webiste: String,
        uname: String,
        pass: String,
        time:u64,
    ) -> Result<()> {
        let entry = &mut ctx.accounts.vault_entry;
        let vault = &mut ctx.accounts.vault;

        entry.website = webiste;
        entry.uname = uname;
        entry.pass = pass;
        entry.time_stored = time;

        vault.masterhash = masterhash;
        vault.entry_count += 1;

        Ok(())
    }

    pub fn add_cid_entry(
        ctx: Context<AddCidEntry>,
        masterhash: Pubkey,
        _c_entry_index: u64,
        cid: String,
    ) -> Result<()> {
        let c_entry = &mut ctx.accounts.cid_entry;
        let vault = &mut ctx.accounts.vault;

        c_entry.cid = cid;
        c_entry.time_stored = Clock::get()?.unix_timestamp as u64;

        vault.masterhash = masterhash;
        vault.cid_count += 1;

        Ok(())
    }

    pub fn update_entry(
        ctx: Context<UpdateEntry>,
        _masterhash: Pubkey,
        _entry_index: u64,
        webiste: String,
        uname: String,
        pass: String,
    ) -> Result<()> {
        let entry = &mut ctx.accounts.vault_entry;

        entry.website = webiste;
        entry.uname = uname;
        entry.pass = pass;

        Ok(())
    }

    pub fn delete_entry(
        ctx: Context<DeleteEntry>,
        _masterhash: Pubkey,
        _entry_index: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.entry_count -= 1;
        Ok(())
    }

    pub fn delete_cid(
        ctx: Context<DeleteCid>,
        _masterhash: Pubkey,
        _c_entry_index: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.cid_count -= 1;
        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(masterhash:Pubkey)]
pub struct InitializeVault<'info> {
    #[account(
        init_if_needed,
        payer= user,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", masterhash.as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(masterhash: Pubkey, c_entry_index: u64)]
pub struct DeleteCid<'info> {
    #[account(
        mut,
        seeds = [b"vault", masterhash.as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        mut,
        seeds = [b"pic", vault.key().as_ref(),&c_entry_index.to_le_bytes()],
        bump,
        close = user,
    )]
    pub cid_entry: Account<'info, CidEntry>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(masterhash: Pubkey, entry_index: u64)]
pub struct DeleteEntry<'info> {
    #[account(
        mut,
        seeds = [b"vault", masterhash.as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        mut,
        seeds = [b"entry", vault.key().as_ref(),&entry_index.to_le_bytes()],
        bump,
        close = user,
    )]
    pub vault_entry: Account<'info, VaultEntry>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(masterhash: Pubkey, entry_index: u64)]
pub struct UpdateEntry<'info> {
    #[account(
        seeds = [b"vault", masterhash.as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        mut,
        seeds = [b"entry", vault.key().as_ref(),&entry_index.to_le_bytes()],
        bump,
        realloc = VaultEntry::INIT_SPACE,
        realloc::payer = user,
        realloc::zero = false,
    )]
    pub vault_entry: Account<'info, VaultEntry>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(masterhash: Pubkey, entry_index: u64)]
pub struct AddVaultEntry<'info> {
    #[account(
        init_if_needed,
        payer= user,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", masterhash.as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        init,
        seeds = [b"entry", vault.key().as_ref(),&entry_index.to_le_bytes()],
        bump,
        payer = user,
        space = 8 + VaultEntry::INIT_SPACE,
    )]
    pub vault_entry: Account<'info, VaultEntry>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(masterhash: Pubkey, c_entry_index: u64)]
pub struct AddCidEntry<'info> {
    #[account(
        init_if_needed,
        payer= user,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", masterhash.as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        init,
        seeds = [b"pic", vault.key().as_ref(),&c_entry_index.to_le_bytes()],
        bump,
        payer = user,
        space = 8 + CidEntry::INIT_SPACE,
    )]
    pub cid_entry: Account<'info, CidEntry>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub masterhash: Pubkey,
    pub entry_count: u64,
    pub cid_count: u64,
}
#[account]
#[derive(InitSpace)]
pub struct VaultEntry {
    #[max_len(100)]
    pub website: String,
    #[max_len(100)]
    pub uname: String,
    #[max_len(100)]
    pub pass: String,
    pub time_stored: u64,
}

#[account]
#[derive(InitSpace)]
pub struct CidEntry {
    #[max_len(100)]
    pub cid: String,
    pub time_stored: u64,
}
