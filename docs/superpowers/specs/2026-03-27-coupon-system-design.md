# Coupon System Design — Web Quote Calculator

## Overview

Add a coupon/discount system to the Web Quote Calculator so Damilola can assign percentage discounts to specific clients. Coupons are single-use, tied to a client email, and expire automatically after 2 weeks.

## Coupon Data Model

**Storage:** `/data/coupons.json` — JSON file on the server.

```json
{
  "DAMI20": {
    "code": "DAMI20",
    "clientEmail": "damiuxcodes@gmail.com",
    "discountPercent": 20,
    "createdAt": "2026-03-27",
    "expiresAt": "2026-04-10T00:00:00Z",
    "used": false,
    "usedAt": null
  }
}
```

## Security Model

- **Server-side validation only** — coupon code + email sent from client, validated in API route
- **Email binding** — coupon code can only be used by the specified client email
- **Single-use** — once marked `used: true`, the coupon cannot be reused
- **Expiry enforcement** — server rejects expired coupons
- **No client-side discount logic** — the quote total is always calculated server-side

## User Flow (Client)

1. Client fills out inquiry form (Step 5)
2. Client enters optional coupon code
3. On submit, API validates coupon:
   - Code exists
   - Email matches coupon's `clientEmail`
   - Not expired
   - Not already used
4. If valid: discount % applied to total, coupon marked `used: true`
5. Confirmation email sent with discounted price

## Admin Panel

**Route:** `/admin` (hidden, password-protected)

**Auth:** Simple password check — no user accounts needed. Password stored in environment variable `ADMIN_PASSWORD`.

**Admin can:**
- View all coupons (active, used, expired)
- Generate new coupon (auto-generates 6-char alphanumeric code, sets client email, discount %, expiry = now + 2 weeks)
- Revoke/delete coupon

## API Endpoints

### `POST /api/validate-coupon`
**Request:**
```json
{ "code": "DAMI20", "email": "damiuxcodes@gmail.com" }
```
**Response (valid):**
```json
{ "valid": true, "discountPercent": 20 }
```
**Response (invalid):**
```json
{ "valid": false, "reason": "expired" | "email_mismatch" | "already_used" | "not_found" }
```

### `POST /api/apply-coupon`
Called on inquiry submit. Marks coupon as used, returns final discounted quote.

### `POST /api/admin/coupons`
**Auth:** Requires `ADMIN_PASSWORD` header.
- `GET` — list all coupons
- `POST` — create new coupon `{ clientEmail, discountPercent }`
- `DELETE` — delete coupon `{ code }`

## Component Changes

### InquiryForm
- Add coupon code input field (optional, below email)
- On coupon code blur, validate against `POST /api/validate-coupon`
- Show discount badge if valid (e.g., "20% off applied ✓")
- Show error if invalid/expired/wrong email

### QuoteSummary
- If valid coupon applied, show original total crossed out and discounted total
- Show discount line: "Coupon (DAMI20): -£X"

### Confirmation Email
- If discount applied, show original price, discount, and final total

## File Changes

| File | Change |
|------|--------|
| `data/coupons.json` | New — JSON store for coupons |
| `src/app/api/validate-coupon/route.ts` | New — coupon validation endpoint |
| `src/app/api/apply-coupon/route.ts` | New — coupon application (marks used) |
| `src/app/api/admin/coupons/route.ts` | New — admin CRUD for coupons |
| `src/components/InquiryForm.tsx` | Add coupon input field + validation |
| `src/components/QuoteSummary.tsx` | Show discount if coupon applied |
| `src/app/api/inquiry/route.ts` | Apply coupon to final quote |
| `.env.local` | Add `ADMIN_PASSWORD` |
| Tests | Add tests for coupon validation logic |

## Pricing Display Change

When a coupon is applied, the quote summary should show:
- Original total: ~~£750~~
- Discount: -£150 (20% off)
- **Final total: £600**

## Expiry Logic

Coupon expires at `expiresAt` timestamp. Server rejects if `Date.now() > expiresAt`.

## Test Scenarios

1. Valid coupon + correct email → valid response
2. Valid coupon + wrong email → `email_mismatch`
3. Valid coupon + expired → `expired`
4. Valid coupon + already used → `already_used`
5. Non-existent code → `not_found`
6. Admin creates coupon → stored correctly
7. Used coupon cannot be reused
