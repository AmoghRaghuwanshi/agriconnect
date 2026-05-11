# AgriConnect — Design Specification

## Design Systems

### Farmer Design System

**Philosophy:** Earth, trust, simplicity. A farmer using this on a 4G phone in a field under sunlight. Every element must be readable in bright light. Large tap targets. Nothing unnecessary.

**Color Palette:**
*   **Primary:** Deep forest green `#1B4332`
*   **Accent:** Warm terracotta `#D97757`
*   **Background:** Off-white parchment `#F9F6F0`
*   **Card surface:** Pure white `#FFFFFF`
*   **Sand/subtle fill:** `#EDE8DF`
*   **Olive text:** `#5C6B3A`
*   **Border:** `#D6CFC4`
*   **Success:** `#2D6A4F`
*   **Warning:** `#E9C46A`
*   **Error:** `#C1121F`

**Typography:**
*   **Heading font:** Fraunces (serif, warm, earthy) — used for page titles and hero text only.
*   **Body font:** Inter — all labels, inputs, body copy.
*   **Heading scale:**
    *   32px (page title)
    *   24px (section)
    *   18px (card title)
    *   14px (label-cap uppercase tracking-widest)
*   **Body:**
    *   15px regular
    *   13px small
    *   11px micro

**Elevation and Texture:**
*   **Cards:** white, 1px border `#D6CFC4`, border-radius 16px, shadow `0 2px 8px rgba(0,0,0,0.06)`
*   No heavy shadows. No glassmorphism. No gradients except subtle from-white to-`#F9F6F0` on voice panel.
*   **Mic button only:** radial pulse animation in terracotta when active.

**Component Tokens:**
*   `btn-primary`: bg `#1B4332`, text white, rounded-full, px-6 py-3, font-medium 15px, hover bg `#2D6A4F`
*   `btn-secondary`: bg white, border `#1B4332`, text `#1B4332`, rounded-full, px-6 py-3, font-medium 15px
*   `btn-ghost`: no border, text `#5C6B3A`, underline on hover, px-6 py-3, font-medium 15px
*   `input-agri`: border `#D6CFC4`, bg white, rounded-12px, px-4 py-3, focus ring `#1B4332` 2px
*   `card-agri`: white bg, border, 16px radius, 24px padding
*   `label-cap`: 11px uppercase, letter-spacing 0.08em, color `#5C6B3A`, font-weight 500
*   `badge-organic`: bg `#D8F3DC`, text `#1B4332`, rounded-full, 10px, px-2
*   `mic-pulse`: keyframe scale 1→1.15→1 at 1.2s infinite, color terracotta

**Navigation — Farmer:**
*   **Bottom tab bar (mobile-first):** icons + labels.
*   **Tabs:** Home, Listings, Orders, Mandi, Profile.
*   **Active tab:** terracotta underline + icon filled.
*   **Top bar:** AgriConnect logo left, notification bell right, no hamburger menu.

---

### Consumer Design System

**Philosophy:** Fresh market, abundance, trust in quality. A city buyer browsing produce on their lunch break. Feels like a premium grocery app — clean, modern, with pops of produce color.

**Color Palette:**
*   **Primary:** Deep market green `#0A6640`
*   **Accent:** Fresh orange `#FF6B35` (call to action)
*   **Secondary accent:** Golden yellow `#FFD166` (highlights, badges)
*   **Background:** Near white with warmth `#FAFAF8`
*   **Card surface:** Pure white `#FFFFFF`
*   **Subtle fill:** `#F0F4F0`
*   **Text primary:** `#1A1A1A`
*   **Text secondary:** `#6B7280`
*   **Border:** `#E5E7EB`
*   **Success:** `#059669`
*   **Tag bg:** `#ECFDF5`

**Typography:**
*   **Heading font:** Plus Jakarta Sans — modern, geometric, confident.
*   **Body font:** Inter.
*   **Scale:**
    *   Hero: 40px bold
    *   Section: 26px semibold
    *   Card title: 18px medium
    *   Label: 13px regular

**Visual Language:**
*   Produce photography fills card headers (rounded-top 16px, object-cover).
*   Pill-shaped filter chips with colored borders.
*   Floating "Add to Cart" button pinned to bottom of product page.
*   Subtle dot-grid background pattern on hero sections only (opacity 4%).
*   Cards: slight elevation `0 4px 16px rgba(0,0,0,0.08)` on hover.

**Component Tokens:**
*   `btn-cta`: bg `#FF6B35`, text white, rounded-full, px-8 py-3, font-semibold
*   `btn-outline`: border `#0A6640`, text `#0A6640`, rounded-full, px-8 py-3, font-semibold
*   `chip-filter`: bg white, border `#E5E7EB`, rounded-full, px-4 py-1.5, 13px — selected: bg `#ECFDF5` border `#0A6640` text `#0A6640`
*   `card-product`: white, 16px radius, overflow-hidden, hover shadow transition 200ms
*   `badge-fresh`: bg `#FFD166`, text `#1A1A1A`, rounded-full, 10px bold

**Navigation — Consumer:**
*   **Top navigation bar:** logo left, search center (expanding), cart icon right with count badge, profile avatar right.
*   **Secondary horizontal scroll tabs below nav:** All, Vegetables, Grains, Fruits, Organic, Near Me.
*   **No bottom tab bar** (desktop-friendly layout).

---

## Farmer Pages

### PAGE F1 — Farmer Onboarding / Welcome
*   **Route:** `/onboarding`
*   **User:** First-time farmer, may be low-literacy.
*   **Layout:** Full-screen illustration: rolling wheat field, sunrise, minimal flat art style in palette colors. Bottom sheet (60% screen height) slides up on load.
*   **Content inside sheet:**
    *   AgriConnect logo (leaf + wordmark).
    *   Headline in Fraunces 32px: "अपनी फसल, अपना दाम" (Your crop, your price).
    *   Subtext 14px olive: "बोलो, हम लिख देंगे" (Speak, we'll write it).
    *   Language selector: 7 flag-chips in a horizontal scroll (हिन्दी, English, मराठी, தமிழ், తెలుగు, ಕನ್ನಡ, বাংলা).
    *   Primary button `btn-primary`: "किसान हूँ / I'm a Farmer" → farmer registration.
    *   Secondary button `btn-secondary`: "खरीदार हूँ / I'm a Buyer" → buyer registration.
    *   Ghost link `btn-ghost`: "Already have an account? Sign in".
*   **States:** Loading skeleton on illustration, error toast if language fetch fails.

### PAGE F2 — Farmer Registration
*   **Route:** `/register/farmer`
*   **Layout:** Single column, progress bar top (step 1 of 3).
*   **Step 1 — Identity:**
    *   Label: "आपका नाम / Your Name", Input: full name.
    *   Label: "मोबाइल नंबर", Input: phone, type=tel, +91 prefix fixed.
    *   Label: "राज्य / State" — searchable dropdown.
    *   Label: "जिला / District" — dependent on state.
    *   Label: "पिनकोड" — 6-digit input, auto-fetches block/tehsil.
    *   Primary button `btn-primary`: "आगे बढ़ें / Next".
*   **Step 2 — Farm:**
    *   "आप क्या उगाते हैं?" multi-select crop chips (Wheat, Paddy, Onion, Tomato, Potato + "अन्य / Other").
    *   "खेत का क्षेत्रफल / Farm size" — number input + unit toggle (Acres / Bigha / Hectare).
    *   GPS auto-capture strip: map thumbnail + "Use my location" button.
    *   Primary button `btn-primary`: "आगे बढ़ें".
*   **Step 3 — Verification:**
    *   OTP screen, 6 boxes.
    *   Resend timer 30s.
    *   On verify: confetti burst animation, redirect to farmer home.

### PAGE F3 — Farmer Home / Dashboard
*   **Route:** `/farmer`
*   **Layout:** Vertical scroll, bottom tab bar.
*   **Sections:**
    *   **Greeting strip:** "नमस्ते, [Name] 🌾" in Fraunces 24px + current date + weather icon (temp, condition).
    *   **Voice action card (most prominent, always first):** Gradient bg from-`#1B4332` to-`#2D6A4F`, white text. Large mic icon center 56px. Text: "बोलो — फसल बेचो, दाम पूछो, ऑर्डर देखो". Subtitle: "Tap and speak in your language". Pulsing ring animation on mic. (This is the MicFAB embedded in a card for prominence).
    *   **Stats row (3 cards horizontal scroll):** Active Listings (count + "चालू लिस्टिंग"), Orders Today (count + "आज के ऑर्डर"), Total Earned (₹amount + "कुल कमाई"). Each: white card, icon top-left in terracotta, number in 28px forest green.
    *   **My Active Listings section:** `label-cap` "मेरी लिस्टिंग". Horizontal scroll of `ListingCard` components. "सब देखें / See all" link → `/farmer/listings`. Empty state: illustration of empty basket + "अभी कोई लिस्टिंग नहीं — बोलकर जोड़ें" + btn "नई लिस्टिंग".
    *   **Mandi Prices strip:** `label-cap` "आज के मंडी भाव". Horizontal scroll: crop name + ₹price/kg + up/down arrow colored green/red. "सब देखें" → `/mandi`.
    *   **Recent Orders preview:** Last 2 orders as mini-cards. "सब देखें" → `/farmer/orders`.
*   **ListingCard component:** 160px wide, 200px tall, white card. Top: produce photo (rounded-t-16). Crop name 15px bold. ₹price/unit in forest green. Quantity remaining small olive text. Status badge: Active (green) / Sold Out (grey) / Expiring (amber).

### PAGE F4 — New Listing (Voice + Form)
*   **Route:** `/farmer/listings/new`
*   **Layout:** Full-page scroll, no sidebar.
*   **Section 1 — Page header:** `label-cap`: "QUICK VOICE LISTING". Fraunces 32px: "Speak. We'll do the rest.". Subtext olive: "Tap mic, say crop + quantity + price in your language".
*   **Section 2 — VoiceListingPanel (`card-agri`, gradient bg):**
    *   Language selector row: horizontal pill chips — हिन्दी · English · मराठी · தமிழ் · తెలుగు — selected chip: forest bg white text, others: white border olive text.
    *   Mic button zone: center-aligned, vertical stack. Circular button 96×96px. Inactive: `#1B4332` bg, white Mic icon 40px. Active: `#D97757` bg, white MicOff icon 40px, pulse ring animation. Status text below: "Tap to speak" / "Listening..." (terracotta when listening).
    *   Transcript textarea: full width, 3 rows, placeholder "Your voice appears here, or type directly...", editable, `input-agri`.
    *   Sample phrase chips: 3 chips below textarea, 10px text, truncated to 40 chars, clicking sets textarea value: "मैं 50 क्विंटल गेहूँ बेचना चाहता हूँ...", "100 kg onion Nashik red, ₹30 per kilo...", "Organic tomato 50 kilo at 25 rupees...".
    *   Auto-fill button: full width, `btn-secondary`, Sparkles icon left. Idle: "✨ Auto-fill with AI". Loading: spinner + "Extracting with Gemini...". Disabled when textarea empty.
    *   Source badge (appears after fill): small pill "Gemini flash ✓" green / "Groq ✓" blue / "Offline mode" grey.
*   **Section 3 — Mandi Suggestion card (appears after successful parse):** Soft green bg `#D8F3DC`, border `#95D5B2`, 12px radius. `label-cap`: "AI MANDI PRICE SUGGESTION". "Suggested: ₹18–₹22/kg · Best mandi: Mandsaur". Small olive text: reason string from API.
*   **Section 4 — Listing Details Form (`card-agri`):** Heading Fraunces 20px: "Listing details". 2-column grid on tablet, 1-column mobile.
    *   Crop * — text input, `data-testid="form-crop"`, AI-filled fields get `ring-2 ring-agri-forest/40` flash 2s.
    *   Category — select: Vegetables / Grains / Dry Fruits.
    *   Variety — text input.
    *   Unit — toggle: kg / quintal.
    *   Quantity * — number input.
    *   Price (B2C) ₹/unit * — number input.
    *   B2B 50+ unit — number input, label "optional".
    *   B2B 200+ unit — number input, label "optional".
    *   Harvest date — date picker, Calendar icon in label.
    *   Location — read-only strip showing GPS coords, MapPin icon, bg sand.
    *   Organic checkbox — "Certified organic produce" with leaf icon.
    *   Photo row — Upload icon + "Photo auto-picked. Upload support coming soon." olive text.
    *   Submit button: `btn-primary` full width — "Publish Listing" / "Publishing..." with spinner.

### PAGE F4b — Edit Listing
*   **Route:** `/farmer/listings/[id]/edit`
*   **Layout:** Same layout as PAGE F4 Section 4 form. All fields pre-populated from existing listing data.
*   **Content:** Submit button label: "Save Changes". Secondary ghost button: "Cancel" → back to `/farmer/listings`. No VoiceListingPanel on edit — form only.

### PAGE F5 — My Listings
*   **Route:** `/farmer/listings`
*   **Layout:** List view.
*   **Content:**
    *   Page title: "मेरी लिस्टिंग / My Listings".
    *   Filter row: All · Active · Sold Out · Expiring.
    *   "+ नई लिस्टिंग" button top-right, terracotta bg.
    *   List of `ListingRow` components: Thumbnail left 64×64 rounded-12. Crop + variety right. ₹price/unit. Quantity · harvest date. Status badge. Kebab menu: Edit / Mark Sold / Delete.
*   **Empty state:** basket illustration + prompt to create first listing.

### PAGE F6 — Farmer Orders
*   **Route:** `/farmer/orders`
*   **Layout:** Tabbed list.
*   **Tabs:** Incoming · Accepted · Dispatched · Completed.
*   **OrderCard component:** Buyer name + city. Crop, quantity, total ₹. Order date. Status chip. Action buttons:
    *   Incoming: "Accept" (forest green) + "Decline" (ghost red).
    *   Accepted: "Mark Dispatched" (terracotta).
    *   Dispatched: "Mark Delivered" (olive).
    *   Completed: "View Details".
*   **Empty state:** Custom illustration per tab.

### PAGE F7 — Mandi Prices
*   **Route:** `/mandi`
*   **Layout:** Full-width table + search.
*   **Content:**
    *   Heading: "आज के मंडी भाव / Today's Mandi Prices".
    *   Search input: crop name.
    *   Filter chips: All States · MP · Maharashtra · UP · Punjab.
    *   Price table: Columns: Crop | Variety | Min ₹ | Max ₹ | Modal ₹ | Mandi | Date. Up/down arrow colored per day change. Alternate row bg `#F9F6F0`.
    *   AI suggestion strip at top: "Based on your pincode (461001): Best price for Wheat is in Mandsaur — ₹2200/quintal" — forest bg white text.

### PAGE F8 — Farmer Profile
*   **Route:** `/farmer/profile`
*   **Layout:** Vertical scroll.
*   **Content:** Avatar circle, name in Fraunces 24px, location + phone. Stats: Total Listings · Total Earnings · Rating (if any). Sections: My Crops (chip list) · Bank Details · Language Preference · Notifications toggle. Sign Out button ghost red bottom.

---

## Consumer Pages

### PAGE C1 — Buyer Home
*   **Route:** `/buyer` or `/`
*   **Layout:** Full width, top nav, content max-w-7xl centered.
*   **Hero section:** Full-width banner, bg `#0A6640`, subtle dot-grid overlay. Heading Plus Jakarta Sans 40px bold white: "Farm Fresh. Direct to You.". Subline white/80: "Buy straight from the farmer. No middlemen. Guaranteed fresh.". Search bar: white rounded-full, placeholder "Search for wheat, tomato, onion...", search icon, full width on mobile. Searching from here navigates to `/buyer/browse` with the search query pre-filled in sidebar filter. Two stat pills: "12,000+ Farmers" · "48hr Delivery".
*   **Category scroll:** Horizontal chips below hero: All · Vegetables · Grains · Dry Fruits · Fruits · Organic. Selected: orange bg white text.
*   **Featured listings grid:** 4-column desktop, 2-column mobile. `ProductCard`: image top full-width 200px object-cover, crop name bold, ₹price/kg, farmer name + state flag emoji, "Add to Cart" orange btn. Hover: card lifts shadow, image scales 1.03.
*   **Recently added strip:** Label "Just Harvested 🌱" — horizontal scroll of `ProductCard`s.
*   **Trust section:** 3 icon+text cards: "Verified Farmers" · "Fresh Guarantee" · "Direct Pricing".

### PAGE C2 — Product Listing / Browse
*   **Route:** `/buyer/browse`
*   **Layout:** Sidebar filters left (240px) + product grid right. This page serves as both the category browse page and the search results page.
*   **Sidebar filters:** Category checkboxes. Price range slider ₹0–₹200/kg. Location — state dropdown. Organic toggle. Harvest date — within 1/3/7 days. Sort: Price low-high / Newest / Distance. "Apply Filters" orange btn + "Reset" ghost.
*   **Product grid:** 3-column, `ProductCard` with farmer name, location, harvest date, quantity available, rating stars. Pagination: page numbers bottom.

### PAGE C3 — Product Detail
*   **Route:** `/buyer/listing/[id]`
*   **Layout:** 2-column desktop (image left, details right), stacked mobile.
*   **Left — Images:** Main image large. Thumbnail strip below (if multiple).
*   **Right — Details:** Crop name Plus Jakarta Sans 28px bold. Variety · Organic badge if applicable. ₹price/kg in orange 24px bold. "by [Farmer Name], [Village], [State]" with avatar. Freshness: "Harvested [date]" green chip. Quantity available. Pricing tiers table: B2C / 50kg+ / 200kg+. Quantity selector: - / number / + input. "Add to Cart" `btn-cta` full-width orange rounded-full. "Contact Farmer" ghost btn (WhatsApp icon). Delivery estimate strip.
*   **Below fold:** Farmer profile mini-card: photo, name, farm size, crops, rating, "View all listings" link. Mandi price comparison: "This listing vs mandi modal price" bar. Similar produce section.

### PAGE C4 — Cart
*   **Route:** `/buyer/cart`
*   **Layout:** 2-column — cart items left, order summary right.
*   **Cart items:** Each: thumbnail, crop+variety, farmer, qty stepper, ₹subtotal, Remove link. Empty state: basket illustration + "Your cart is empty" + "Browse Produce" btn.
*   **Order summary card:** Subtotal. Delivery estimate. Total bold. "Proceed to Checkout" orange btn.

### PAGE C5 — Checkout
*   **Route:** `/buyer/checkout`
*   **Layout:** Step indicator top (3 steps). Order summary sidebar sticky.
*   **Step 1 — Delivery:** Name, phone, address, city, state, pincode inputs. Map pin for location (optional).
*   **Step 2 — Payment:** UPI (default selected with radio). Card. COD.
*   **Step 3 — Confirmation:** Confetti animation. Order ID. Estimated delivery. "Track Order" btn. "Continue Shopping" ghost btn.

### PAGE C6 — Buyer Orders
*   **Route:** `/buyer/orders`
*   **Layout:** List with status tabs.
*   **Tabs:** Active · Delivered · Cancelled.
*   **OrderCard:** produce image, crop+qty, farmer, total, status pill, "Track" / "Reorder" btn.

### PAGE C6b — Order Tracking
*   **Route:** `/buyer/orders/[id]/track`
*   **Layout:** Vertical scroll.
*   **Content:** Stepper component top: Ordered → Confirmed → Dispatched → Delivered. Active step in orange, completed in green, upcoming in grey. Below stepper: estimated delivery date in Plus Jakarta Sans 20px bold. Farmer contact card: avatar, name, phone number, "Call Farmer" btn (tel: link), "WhatsApp" btn. Map placeholder strip (static image, not live map for MVP). "Back to Orders" ghost link bottom.

### PAGE C7 — Buyer Profile
*   **Route:** `/buyer/profile`
*   **Content:** Avatar, name, email, phone. Sections: Delivery Addresses · Order History · Preferences (preferred crops) · Notifications. Sign Out.

---

## Shared Components

*   **MicFAB:** Fixed bottom-right, 56px circle, forest green bg, white Mic icon. Farmer side only. Active: expands to 240px wide pill showing transcript text live + MicOff icon right. Pulse ring when listening.
*   **Error States (all form inputs):** Invalid/empty required field: border changes to `#C1121F`, 12px error message below in `#C1121F`, warning icon appears inside input on the right. Applied to: all inputs in F2 (Registration), F4 (New Listing), C5 (Checkout).
*   **Logo Spec:**
    *   **Logomark:** A single wheat stalk icon, minimal line-art, 24×24px. Color: white when on dark bg, `#1B4332` on light bg.
    *   **Wordmark:** "AgriConnect" in Fraunces on farmer side, Plus Jakarta Sans on consumer side. Always paired with logomark left.
    *   **Farmer nav:** white logo on forest green top bar.
    *   **Consumer nav:** green logo on white top bar.
*   **Toast notifications:** Bottom center, rounded-full, slide-up animation, 3s auto-dismiss. Types: success (green), warning (amber), error (red), info (blue). Max 3 stacked.
*   **Loading skeleton:** Used on all list pages while fetching. Gray animated shimmer blocks matching the shape of cards.
*   **Empty states:** Every list page and tab has a custom illustration (flat, in palette colors) + headline + CTA button.
*   **404 page:** Farmer side: illustration of farmer looking confused in field. Consumer side: illustration of empty market stall. Both: "Go Home" btn.

---

## Animation Tokens

*   **Mic button:** `@keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(217,119,87,0.4) } 50% { box-shadow: 0 0 0 16px rgba(217,119,87,0) } } 1.2s infinite`
*   **AI-filled fields:** `ring-2 ring-green-400` transition-all for 2000ms then fades.
*   **Page transitions:** fade-in 150ms ease.
*   **Card hover:** `transform: translateY(-2px)` + shadow increase 200ms.
*   **Bottom tab active:** underline slides with 200ms ease.
*   **Confetti:** on registration success and order confirmation.
*   **Source badge:** slides in from right 300ms after AI fill.

---

## Responsive Rules

*   **Mobile first:** 375px base.
*   **sm:** 640px — 2-column grids start.
*   **md:** 768px — sidebar appears on browse page.
*   **lg:** 1024px — full desktop nav.
*   **xl:** 1280px — max content width.

---

## Accessibility Notes

*   **Minimum tap target:** 44×44px for all interactive elements.
*   **Color contrast:** All color combos must pass WCAG AA.
*   **Aria:** All icons must have `aria-label`.
*   **Inputs:** All inputs must have visible labels (not just placeholder).
