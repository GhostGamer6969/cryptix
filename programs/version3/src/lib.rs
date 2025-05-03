use anchor_lang::prelude::*;


declare_id!("FLyBksegh9gkLK1MGojo9VL3VeBWbEwsDJpY9oHWAc45");

#[program]
pub mod version3 {
    use super::*;

    pub fn add_vault_entry(
        ctx: Context<AddVaultEntry>,
        masterhash: Pubkey,
        _entry_index: u64,
        webiste: String,
        uname: String,
        pass: String,
    ) -> Result<()> {
        let entry = &mut ctx.accounts.vault_entry;
        let vault = &mut ctx.accounts.vault;

        entry.website = webiste;
        entry.uname = uname;
        entry.pass = pass;
        entry.time_stored = Clock::get()?.unix_timestamp as u64;

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
