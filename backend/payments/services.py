"""
Paystack payment service.
When PAYSTACK_SECRET_KEY is not set, falls back to mock mode for local dev.
"""
import uuid
import hashlib
import hmac
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

PAYSTACK_BASE_URL = "https://api.paystack.co"


def get_secret_key():
    return getattr(settings, 'PAYSTACK_SECRET_KEY', None)


def is_mock_mode():
    """Returns True if Paystack key is not configured (local dev fallback)."""
    return not get_secret_key()


def generate_reference():
    """Generate a unique payment reference."""
    return f"RWN-{uuid.uuid4().hex[:16].upper()}"


def initialize_transaction(email: str, amount_kobo: int, reference: str, callback_url: str, metadata: dict = None):
    """
    Initialize a Paystack transaction.
    amount_kobo: amount in kobo (100 kobo = ₦1)
    Returns dict with authorization_url and reference.
    """
    if is_mock_mode():
        logger.warning("[Paystack] Running in MOCK MODE — no real charges.")
        return {
            "status": True,
            "data": {
                "authorization_url": f"/payment/mock-verify?reference={reference}",
                "access_code": "mock_access_code",
                "reference": reference,
            }
        }

    headers = {
        "Authorization": f"Bearer {get_secret_key()}",
        "Content-Type": "application/json",
    }
    payload = {
        "email": email,
        "amount": amount_kobo,
        "reference": reference,
        "callback_url": callback_url,
        "metadata": metadata or {},
    }
    try:
        res = requests.post(f"{PAYSTACK_BASE_URL}/transaction/initialize", headers=headers, json=payload, timeout=15)
        return res.json()
    except Exception as e:
        logger.error(f"[Paystack] initialize_transaction error: {e}")
        return {"status": False, "message": str(e)}


def verify_transaction(reference: str):
    """
    Verify a Paystack transaction by reference.
    Returns the full Paystack response dict.
    """
    if is_mock_mode():
        return {
            "status": True,
            "data": {
                "status": "success",
                "reference": reference,
                "amount": 500000,
                "channel": "mock",
                "paid_at": "2026-01-01T00:00:00.000Z",
                "id": "mock_id",
            }
        }

    headers = {"Authorization": f"Bearer {get_secret_key()}"}
    try:
        res = requests.get(f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}", headers=headers, timeout=15)
        return res.json()
    except Exception as e:
        logger.error(f"[Paystack] verify_transaction error: {e}")
        return {"status": False, "message": str(e)}


def verify_webhook_signature(payload_bytes: bytes, signature: str) -> bool:
    """Verify Paystack webhook HMAC-SHA512 signature."""
    secret = get_secret_key()
    if not secret:
        return True  # Skip verification in mock mode
    expected = hmac.new(secret.encode(), payload_bytes, hashlib.sha512).hexdigest()
    return hmac.compare_digest(expected, signature)
