# Verification & Trust System

The Verification module is a trust-and-safety layer designed to validate the authenticity of users, companies, and their declared assets (like infrastructure).

---

## Core Concepts

- **Verification Request**: A formal submission by a user to have a specific attribute verified (Identity, Skill, Infrastructure, or Company).
- **Trust Badges**: Visual indicators awarded to users upon successful verification.
- **Evidence-Based Proof**: Verification requires external proof (documents, URLs, or file uploads).

---

## Verification Types

1. **IDENTITY**: National ID, Passport, or other legal identification.
2. **SKILL**: Certifications, diplomas, or verified portfolio links.
3. **INFRASTRUCTURE**: Proof of "Remote-Ready" assets such as Solar Power systems, Starlink/High-speed ISP, or dedicated home office setups.
4. **COMPANY (KYB)**: "Know Your Business" verification for employers to ensure legal registration.

---

## Data Models

### `VerificationRequest`
The primary model for managing the lifecycle of a verification attempt.
- `user`: The requester.
- `request_type`: One of the four types listed above.
- `status`: PENDING, IN_PROGRESS, VERIFIED, or REJECTED.
- `evidence`: File upload (e.g., PDF of a certificate).
- `metadata`: JSON storage for structured proof (e.g., certificate IDs).

### `TrustBadge`
Global definition of a badge.
- `name`: e.g., "Solar Powered", "Starlink Verified", "Skill Expert".
- `icon`: The visual identifier.

### `UserBadge`
The many-to-many relationship linking badges to users.
- `user`: The badge holder.
- `badge`: The specific TrustBadge awarded.
- `verified_at`: Timestamp of the award.

---

## Workflow

1. **Submission**: User creates a `VerificationRequest` and uploads proof.
2. **Review**: Admins or automated agents review the evidence.
3. **Approval**: If approved, the status changes to `VERIFIED` and a `UserBadge` is automatically generated for the user.
4. **Visibility**: Awarded badges are displayed on the user's public profile and in job application views to increase trust for employers.

---

## API Endpoints

### `POST /api/v1/verification/requests/`
Submit a new verification request with file/URL evidence.

### `GET /api/v1/verification/my-status/`
Check the status of all active and past verification requests for the current user.

### `GET /api/v1/verification/badges/`
List all available trust badges in the system.
