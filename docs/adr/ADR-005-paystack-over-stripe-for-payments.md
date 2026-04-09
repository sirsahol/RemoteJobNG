# ADR-005: Paystack Over Stripe for Payment Processing

**Date**: 2025-03-20  
**Status**: Accepted  
**Deciders**: @sirsahol  

---

## Context

RemoteWorkNaija monetises through job post promotions — employers pay to feature their listings or access premium slots. The platform needs a payment processor that handles the primary user base effectively.

The platform's employer user base is predominantly Nigerian businesses and individuals. While some international employers will post jobs, the majority of payment volume will originate from Nigerian bank accounts and cards.

---

## Decision

Use **Paystack** as the primary payment processor. Integrate via the Paystack REST API — `/api/payments/initialize/` to create a payment session and `/api/payments/verify/` to confirm after redirect.

A `PaystackService` class in `backend/payments/services.py` wraps all Paystack API calls. The service is **mock-safe**: if `PAYSTACK_SECRET_KEY` is not set, it returns synthetic responses — enabling full payment flow testing in development without a real key.

---

## Rationale

### Why Paystack

1. **Nigerian bank and card support**: Paystack natively supports Verve cards, GTBank, Access Bank, Zenith Bank, and all major Nigerian card schemes. Stripe's support for Nigerian-issued cards is inconsistent and requires workarounds.

2. **Naira (NGN) as a first-class currency**: Paystack processes NGN natively with no conversion. Stripe supports NGN but routes it through their global infrastructure with higher effective fees for Nigerian merchants.

3. **Local regulatory compliance**: Paystack is licensed by the Central Bank of Nigeria (CBN). All transactions are CBN-compliant. Stripe requires additional setup to be CBN-compliant for Nigerian businesses.

4. **Lower fees for Nigerian volume**: Paystack charges 1.5% + ₦100 (capped at ₦2,000) for local cards. Stripe charges 2.9% + $0.30 for international processing — significantly more expensive for high-volume NGN transactions.

5. **USSD and bank transfer support**: Paystack supports USSD payment codes (e.g. *737#) and bank transfers — critical for users without cards. Stripe does not support these payment methods.

6. **Webhook reliability**: Paystack's webhook delivery has documented retry logic and an event signature verification mechanism (HMAC-SHA512) equivalent to Stripe's webhook security.

7. **Developer experience**: Paystack's dashboard, API documentation, and test mode are excellent and well-maintained. Test card numbers work reliably in CI.

---

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| **Stripe** | Does not support Verve cards or Nigerian bank account payouts natively. Higher fees on NGN. Not CBN-licensed. Requires international card for most Nigerian employers. Poor UX for the target user base. |
| **Flutterwave** | Strong alternative — also CBN-licensed with Nigerian card support. Paystack was chosen for its superior developer experience (cleaner API, better docs, more reliable test mode) and wider adoption among Nigerian developers. Can be added as a secondary processor in Phase 2. |
| **PayPal** | No NGN support. Requires USD account. Most Nigerian users don't have PayPal accounts or face withdrawal restrictions. |
| **Manual bank transfer** | No real-time payment verification. Requires manual admin confirmation. Doesn't scale. |
| **Crypto payments** | Regulatory grey area in Nigeria. High volatility unsuitable for job post pricing. Adds UX friction for non-technical users. |

---

## Payment Flow Architecture

```
Employer clicks "Post Featured Job"
  → POST /api/payments/initialize/
      → PaystackService.initialize_payment(email, amount, metadata)
      → Returns {authorization_url, reference}
  → Frontend redirects to authorization_url (Paystack hosted checkout)
  → User completes payment on Paystack
  → Paystack redirects to /payment/verify?reference=<ref>
  → Frontend calls GET /api/payments/verify/?reference=<ref>
      → PaystackService.verify_payment(reference)
      → On success: JobPayment.status = 'completed', Job.is_featured = True
      → Returns {success: true, job_id: ...}
  → Frontend shows success state, job is now featured
```

Webhook (parallel path for reliability):
```
Paystack sends POST to /api/payments/webhook/
  → Verify HMAC-SHA512 signature with PAYSTACK_SECRET_KEY
  → Update JobPayment and Job on charge.success event
```

---

## Mock Mode

```python
class PaystackService:
    def initialize_payment(self, email, amount, metadata=None):
        if not settings.PAYSTACK_SECRET_KEY:
            # Mock mode: return synthetic response for local dev
            return {
                "status": True,
                "data": {
                    "authorization_url": "http://localhost:3000/payment/verify?reference=mock_ref_123",
                    "reference": "mock_ref_123",
                }
            }
        # Real API call
        ...
```

This allows the entire payment flow to be tested locally without a real Paystack account.

---

## Consequences

### Positive
- Nigerian employers can pay with any local card, USSD, or bank transfer — maximum conversion rate
- CBN-compliant from day one — no regulatory risk
- Lower processing fees than Stripe for NGN volume
- Mock mode enables development and CI testing without credentials
- Webhook + redirect verification provides double confirmation — no missed payments

### Negative / Trade-offs
- International employers (US, UK, EU) cannot pay in USD via Paystack — they need a USD Paystack account or another processor. Stripe or a USD option should be added in Phase 2 for international employer monetisation.
- Paystack's international expansion is ongoing — not available as a processor in all countries where employers may originate.
- Mock mode returns a localhost redirect URL — requires `http://localhost:3000` to be running to complete the mock flow.

---

## References
- [Paystack API documentation](https://paystack.com/docs/api/)
- [Paystack webhook guide](https://paystack.com/docs/payments/webhooks/)
- [Paystack test cards](https://paystack.com/docs/payments/test-payments/)
- [docs/payments.md](../payments.md)
