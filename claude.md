# Familiar — Web App UI Mini PRD

## 1. Product Purpose

Familiar is a **caregiver dashboard** that helps track people recently seen by a dementia support camera system.

The web app allows caregivers to:

* View recent interactions
* Review unknown people detected
* Label unidentified people
* Browse saved individuals

For the hackathon MVP, the app will be:

* **UI only**
* **Mobile-friendly**
* **Minimalistic**

Backend integration will be added later.

---

# 2. App Structure

The web app has **two main sections**.

### Public Pages

1. Landing Page
2. Sign In Page

### App Dashboard

3. Home
4. Unknown Person Review
5. Recent Interactions
6. People Directory
7. Person Detail

---

# 3. Design System

### Color Palette

Primary
**Light Green** – buttons, highlights, badges

Background
**White**

Secondary Background
**Light Gray**

Example Tailwind palette idea:

```
Primary:  green-300 / green-400
Background: white
Secondary: gray-100
Borders: gray-200
Text: gray-700 / gray-900
```

---

### Typography

Simple and readable.

```
Headings: text-xl / text-2xl
Body: text-sm / text-base
```

---

### UI Style Rules

Minimalistic.

Use:

* Rounded cards
* Soft shadows
* Large buttons
* Clean spacing
* Simple icons
* Lots of white space

Avoid:

* heavy gradients
* complex animations
* cluttered dashboards
* dark mode (for now)

---

# 4. Navigation Structure

After login the app shows a **mobile-style layout**.

Top bar:

```
Familiar
```

Bottom navigation:

```
Home | Alerts | People
```

Optional desktop sidebar later.

---

# 5. Landing Page

Purpose: explain the product.

### Layout

Hero section

```
Familiar
Helping caregivers remember who matters.
```

Subtext:

```
A camera-assisted memory system that helps caregivers track interactions
and identify people seen throughout the day.
```

Primary button:

```
Sign In
```

---

### Features Section

3 simple cards.

Card 1

```
Face Detection
Automatically detects when someone interacts with the user.
```

Card 2

```
Unknown Person Alerts
Caregivers are notified when someone new appears.
```

Card 3

```
Interaction Timeline
Review recent visits and interactions easily.
```

---

### How It Works

3 step layout.

```
1. Camera detects a face
2. System checks if the person is known
3. Caregiver labels new people
```

---

### Footer

```
Familiar
Hackathon project
```

---

# 6. Sign In Page

Minimal login page.

Centered card.

Fields:

```
Email
Password
```

Button:

```
Sign In
```

Below button:

```
Continue to Dashboard
```

For hackathon:

This can simply redirect to `/dashboard`.

---

# 7. Dashboard — Home

Purpose: quick overview.

Sections:

### System Status Card

```
Camera Status: Online
Last Event: 2 minutes ago
```

Indicator dot:

```
green = online
gray = offline
```

---

### Pending Alerts Card

```
Unknown People Detected
3 Pending Alerts
```

Button:

```
Review Alerts
```

---

### Recent Interactions Preview

List of last 3 events.

Each item:

```
[thumbnail]  John — Neighbor
Seen 10 minutes ago
```

If unknown:

```
Unknown Person
Seen 5 minutes ago
```

---

# 8. Unknown Person Review

Purpose: label unidentified people.

Card layout.

Top:

Image snapshot.

Below:

```
Detected at 2:45 PM
```

Form fields:

```
Name
Relationship
Optional note
```

Button:

```
Save Person
```

---

# 9. Recent Interactions Page

Timeline list.

Each card shows:

```
[image thumbnail]

John — Neighbor
Seen 1 hour ago
Status: Recognized
```

Unknown example:

```
Unknown Person
Seen 15 minutes ago
Status: Unknown
```

Badge colors:

```
recognized → green
unknown → gray
labeled → light green
```

---

# 10. People Directory

Grid or list of people.

Card:

```
John
Neighbor
Last seen: today
```

Search bar at top:

```
Search people...
```

---

# 11. Person Detail Page

Shows details for one person.

Top section:

```
John
Neighbor
Note: Livor
```

Divider.

Visit history list:

```
Seen today at 3:00 PM
Seen yesterday at 11:45 AM
Seen yesterday at 5:20 PM
```

---

# 12. Core Components

Reusable UI components.

```
Navbar
Card
Button
Input
Badge
ImageThumbnail
PersonCard
InteractionItem
AlertCard
```

---

# 13. Folder Structure (Frontend)

```
frontend/
src/
 components/
  ui/
   Button.tsx
   Card.tsx
   Input.tsx
  layout/
   Navbar.tsx
   DashboardLayout.tsx

 pages/
  Landing.tsx
  SignIn.tsx
  Home.tsx
  Alerts.tsx
  Interactions.tsx
  People.tsx
  PersonDetail.tsx

 mock/
  alerts.ts
  interactions.ts
  people.ts

 App.tsx
 main.tsx
```

---

# 14. Mock Data

During UI development use fake data.

Example interaction:

```
{
 id: "1",
 name: "John",
 relationship: "Neighbor",
 time: "10 minutes ago",
 status: "recognized"
}
```

---

# 15. MVP UI Goal

By the end of UI build:

You should have a **fully clickable prototype**:

Landing page
→ Sign In
→ Dashboard
→ Alerts page
→ People directory
→ Person detail

Even with **fake data**, it should feel like a real product.

---