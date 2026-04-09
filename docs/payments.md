# Payments

RemoteWorkNaija uses Paystack as its primary payment processor. Paystack is Nigerian-native, supports both Naira (NGN) and USD, and handles card payments, bank transfers, and USSD for Nigerian users.

---

## Overview

Payments enable employers to promote their job listings. Three tiers are available:

| Tier | Name | NGN | USD | Posts | Featured Badge |
|---|---|---|---|---|---|
| basic | Basic Listing | ₦5,000 | $5 | 1 | No |
| featured | Featured Listing | ₦15,000 | $15 | 3 | Yes |
| premium | Employer Bundle | ₦35,000 | $35 | 10 | Yes |

A "featured" job appears at the top of listings (filtered via `?is_featured=true`) and gets a badge in the UI.

---

## Mock Mode (Local Development)

When `PAYSTACK_SECRET_KEY` is not set in `.env`, the Paystack service automatically enters mock mode. All transactions return successful mock responses without hitting the Paystack API. This means the entire payment flow works locally without a real Paystack account.

Mock behavior:
- `initialize_transaction()` returns `authorization_url: "/payment/mock-verify?reference=xxx"`
- `verify_transaction()` returns a mock success response with amount 500000 kobo (₦5,000)
- Webhook signature verification is skipped

To disable mock mode: set `PAYSTACK_SECRET_KEY` in `.env`.

---

## Payment Flow (Step by Step)

```
1. Employer visits /pricing
2. Frontend fetches GET /api/v1/payment/plans/ → displays 3 plan cards
3. Employer clicks "Get Started" on a plan
4. Frontend calls POST /api/v1/payment/initiate/ with { plan_id, job_id }
5. Backend:
   a. Creates JobPayment with status='pending', reference='RWN-{16hex}'
   b. Calls Paystack /transaction/initialize with email, amount_kobo, callback_url
   c. Returns { authorization_url, reference, amount }
6. Frontend redirects to Paystack checkout (authorization_url)
7. User completes payment on Paystack-hosted page
8. Paystack redirects to /payment/verify?reference=RWN-xxx
9. Frontend calls GET /api/v1/payment/verify/?reference=RWN-xxx
10. Backend calls Paystack /transaction/verify/{reference}
11. If status == 'success':
    a. JobPayment.status = 'success', paid_at = now
    b. If plan.is_featured: Job.is_featured = True
    c. Returns { status: 'success', message: '...' }
12. Frontend shows success state → redirects to /dashboard/employer
13. Paystack ALSO fires webhook to /api/v1/payment/webhook/ (async, for reliability)
```

---

## Paystack Service (`payments/services.py`)

### `initialize_transaction(email, amount_kobo, reference, callback_url, metadata)`

Calls `POST https://api.paystack.co/transaction/initialize`.

- `amount_kobo`: amount in kobo (100 kobo = ₦1). For ₦15,000: pass `1500000`.
- `reference`: unique string, format `RWN-{uuid4_hex[:16].upper()}`
- `callback_url`: where Paystack redirects after payment e.g. `https://remoteworknaija.com/payment/verify`

Returns Paystack response with `authorization_url` and `access_code`.

### `verify_transaction(reference)`

Calls `GET https://api.paystack.co/transaction/verify/{reference}`.

Returns full Paystack response. Check `data.status == 'success'` to confirm payment.

### `generate_reference()`

Returns a unique reference string: `RWN-{16 uppercase hex chars}` e.g. `RWN-A1B2C3D4E5F6G7H8`.

### `verify_webhook_signature(payload_bytes, signature)`

Called before processing any webhook event. Uses HMAC-SHA512:

```python
expected = hmac.new(secret.encode(), payload_bytes, hashlib.sha512).hexdigest()
return hmac.compare_digest(expected, signature)
```

Returns `True` if valid, `False` if tampered. In mock mode (no secret key), always returns `True`.

---

## Webhook

Paystack fires `POST /api/v1/payment/webhook/` for payment events. This is a redundancy mechanism — if the user closes their browser before the frontend can call `/verify`, the webhook still updates the payment status.

**Supported events:**
- `charge.success` — payment completed successfully

**Webhook handling:**
1. Verifies HMAC-SHA512 signature from `X-Paystack-Signature` header
2. Rejects with 400 if signature invalid
3. On `charge.success`:
   - Finds `JobPayment` by `data.reference`
   - Sets `status='success'`, `paid_at=data.paid_at`, stores `paystack_response` JSON
   - If `plan.is_featured`: sets `job.is_featured=True`

---

## Database Models

See [data-models.md](data-models.md) for full field reference on `PaymentPlan` and `JobPayment`.

Key indexes on `JobPayment`:
- `['reference']` — fast lookup on webhook/verify
- `['status']` — filter pending/successful payments
- `['employer']` — fetch employer payment history

---

## Seeding Plans

```bash
python manage.py seed_plans
```

Creates the 3 default plans if they don't exist. Idempotent — safe to run multiple times.

To add a new plan or modify prices, edit `backend/payments/management/commands/seed_plans.py` and re-run.

---

## Integrating Flutterwave (Future)

Flutterwave will be added as a secondary payment processor in Phase 2 for broader African coverage. The pattern mirrors Paystack:

1. Create `payments/services_flutterwave.py` with `initialize_transaction()` and `verify_transaction()`
2. Add `FLUTTERWAVE_SECRET_KEY` to settings and `.env.example`
3. Add `provider` field to `JobPayment` with choices `paystack | flutterwave`
4. Update `InitiatePaymentView` to accept `?provider=flutterwave` param

---

## Paystack Dashboard Setup

1. Create account at [dashboard.paystack.com](https://dashboard.paystack.com)
2. Get your secret key and public key from Settings → API Keys
3. Add to backend `.env`:
   ```
   PAYSTACK_SECRET_KEY=sk_live_xxxxx
   PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   FRONTEND_URL=https://remoteworknaija.com
   ```
4. Add to frontend `.env.local`:
   ```
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   ```
5. In Paystack dashboard, configure webhook URL: `https://api.remoteworknaija.com/api/v1/payment/webhook/`
