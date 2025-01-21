### **🚀 Anchor Quick Reference Cheat Sheet for Beginners**  
**By: Your Journey from Zero to Anchor Expert!**

---

## **📌 1. Understanding PDAs and Seeds**
**What is `b"state"` in `seeds = [b"state", user.key().as_ref()]`?**
- `b"state"` → A **byte string literal** used as a **fixed prefix** for deriving a **Program Derived Address (PDA)**.
- `user.key().as_ref()` → The user's **public key**, making the PDA unique per user.
- **PDA Formula:**  
  ```rust
  PDA = hash(b"state" + user_pubkey)
  ```
- **You can change `"state"` to anything**, but the PDA must match everywhere.

---

## **📌 2. Anchor Structs: Accounts & Signers**
**What is `pub signer: Signer<'info>`?**
- **`signer`** → A variable name (**you can rename this**).  
- **`Signer<'info>`** → A **built-in Anchor type** that ensures this account **signed the transaction**.  
✅ You can rename `signer` to `user`, `owner`, etc., but **not `Signer` itself**.

---

**What is `pub vault_state: Account<'info, VaultState>`?**
- **`vault_state`** → A variable name (**you can rename it**).  
- **`Account<'info, VaultState>`** → A **built-in Anchor type** that represents an **on-chain account storing custom data**.  
✅ Ensures **this account exists, is owned by the program, and matches `VaultState` struct**.

---

## **📌 3. Account Validation & Constraints**
**Example `Initialize` Struct with Constraints**
```rust
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init, 
        payer = user,
        space = 8 + VaultState::INIT_SPACE,
        seeds = [b"state", user.key().as_ref()], 
        bump
    )]
    pub state: Account<'info, VaultState>,

    #[account(
        seeds = [b"vault", state.key().as_ref()], 
        bump
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}
```
### **💡 Breakdown of Constraints**
| Constraint | Meaning |
|------------|---------|
| `#[account(mut)]` | Account **can be modified**. |
| `#[account(init)]` | Creates a **new account** on-chain. |
| `payer = user` | The **user wallet pays for rent**. |
| `space = 8 + VaultState::INIT_SPACE` | Reserves **storage space** for the account. |
| `seeds = [...]` | Defines **seeds for PDA derivation**. |
| `bump` | **Required for PDA accounts** (auto-generated). |

---

## **📌 4. Deposit & Withdraw Fixes**
### **💡 Corrected `deposit`**
```rust
impl<'info> Payments<'info>{
    pub fn deposit(&mut self, amount: u64) -> Result<()>{
        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.user.to_account_info(),
            to: self.vault.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(cpi_ctx, amount)?;  // ✅ Fix: Handle transfer result

        Ok(())
    }
}
```

### **💡 Corrected `withdraw` (Fixing PDA Signing)**
```rust
impl<'info> Payments<'info>{
    pub fn withdraw(&mut self, amount: u64) -> Result<()>{
        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };

        let vault_bump = self.state.vault_bump;
        let vault_state_key = self.state.to_account_info().key;
        let seeds = &[b"vault", vault_state_key.as_ref(), &[vault_bump]];
        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        transfer(cpi_ctx, amount)?;  // ✅ Fix: Properly handling transfer result

        Ok(())
    }
}
```
### **🚨 Why Use `signer_seeds` in Withdraw?**
- The **vault is a PDA** (no private key).
- **Solution:** Use the **correct seeds** (`b"vault", state.key().as_ref()`) to sign on behalf of the PDA.

---

## **📌 5. Common Errors & Fixes**
| Error | Cause | Fix |
|--------|---------|------|
| `a non-optional init constraint requires a non-optional system_program` | Missing `system_program` when using `init`. | Add `pub system_program: Program<'info, System>,` |
| `expected &[u8], found &str` | Used `"state"` instead of `b"state"`. | Change `"state"` to `b"state"` (byte string). |
| `Cross-program invocation with unauthorized signer` | PDA needs signer seeds for withdraw. | Use `CpiContext::new_with_signer()`. |

---

## **📌 6. Anchor Code Structure (Best Practice)**
```rust
declare_id!("YourProgramIDHere");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(init, payer = user, space = 8 + VaultState::INIT_SPACE, seeds = [b"state", user.key().as_ref()], bump)]
    pub state: Account<'info, VaultState>,

    #[account(seeds = [b"vault", state.key().as_ref()], bump)]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct VaultState {
    pub vault_bump: u8,
    pub state_bump: u8,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: InitializeBumps) -> Result<()> {
        self.state.vault_bump = bumps.vault;
        self.state.state_bump = bumps.vault_state;
        Ok(())
    }
}
```
✅ **Best Practices:**
- **Functions first** (`#[program]` at the top).
- **Account validation structs next** (`#[derive(Accounts)]`).
- **Account data structs last** (`#[account]`).
- **Implementation details at the bottom** (`impl<'info> Initialize<'info>`).

---

### **🔥 Final Takeaways**
✔ **Use `b"state"` for PDA seeds** instead of `"state"`.  
✔ **Signer (`Signer<'info>`) ensures the transaction is approved.**  
✔ **Account (`Account<'info, T>`) ensures an on-chain account exists.**  
✔ **PDA withdrawals must use `CpiContext::new_with_signer()`.**  
✔ **Always include `system_program` when using `init`.**  
✔ **Follow the correct code structure for readability & maintainability.**  

---

