# Admin UI Design — Coupon System

## Overview
Simple hidden admin panel at `/admin` for managing coupons. Password-protected, accessible only to Damilola.

## Auth Flow
1. User visits `/admin`
2. Password prompt shown (single input + submit)
3. On correct password → admin panel shown
4. On wrong password → error message, stays on login

Password checked against `ADMIN_PASSWORD` env var via API.

## Layout (Option A — Simple)
Single page, two sections:

**Top: Create New Coupon**
- Client email input
- Discount % input (number, 1-100)
- "Generate Coupon" button
- On success: show generated code, reset form

**Below: All Coupons**
- Table: Code | Client Email | Discount | Status | Created | Expires | Actions
- Status badges: Active (green), Used (grey), Expired (red)
- Delete button per coupon (with confirmation)
- Refresh button to reload list

## Design
- Match existing app aesthetic (dark theme, indigo accent)
- Clean table with hover states
- Responsive (stacks on mobile)

## API Calls
- `GET /api/admin/coupons` — fetch all coupons
- `POST /api/admin/coupons` — create coupon
- `DELETE /api/admin/coupons` — delete coupon (body: `{ code }`)

## Files
- `src/app/admin/page.tsx` — admin page component
- Update existing components as needed

## Validation
- Email must be valid format
- Discount must be 1-100
- Coupon code auto-generated (6-char alphanumeric, uppercase)
