

# Internal Functionality Improvements Plan

## 1. Demo Mode Banner & Exit
**File:** `src/components/layout/AppLayout.tsx`
- Add a sticky top banner when `isDemo` is true: "You're in demo mode — [Create an Account] to save your progress"
- Banner links to `/auth` and calls `signOut()` to clear demo state

## 2. Student Unenroll Flow
**Files:** `src/pages/Groups.tsx`, `src/components/groups/ClassSidebar.tsx`
- Add "Leave Class" option in the class sidebar or chat header for students
- Confirmation dialog before unenrolling
- Call `supabase.from('enrollments').update({ is_active: false })` on confirm
- Refresh enrollment list after

## 3. Tutor Class Edit & Delete
**Files:** `src/components/groups/GroupChatPanel.tsx`, new `src/components/groups/EditClassForm.tsx`
- The GroupChatPanel already has dropdown menu items for Edit/Delete — wire them up
- Create EditClassForm dialog (pre-filled with class data) that updates the `classes` table
- Delete: soft-delete by setting `is_active = false` with confirmation dialog
- Refresh class list after changes

## 4. Resource Upload for Tutors
**Files:** `src/pages/Resources.tsx`, new `src/components/resources/UploadResourceForm.tsx`
- **Database migration:** Create a storage bucket `resources` for file uploads
- Add "Upload Resource" button (visible to tutors only)
- Upload dialog with: title, description, subject, grade, file picker
- Upload file to storage bucket, save metadata to `resources` table
- Show upload progress indicator

## 5. Profile Enhancements
**File:** `src/pages/Profile.tsx`
- **For students:** Add "My Subscriptions" card listing enrolled classes with "Unsubscribe" button
- **For tutors:** Add bio textarea and subjects multi-select (requires adding `bio` and `subjects` columns to `profiles` table via migration)
- Replace avatar URL input with file upload button (upload to storage, save URL)

## 6. Schedule "Join Class" Button
**File:** `src/pages/Schedule.tsx`
- In the day detail dialog, add a "Join Class" / "Start Session" button next to each class
- Navigate to `/classroom?room=...&title=...` on click

## 7. Notifications System (Basic)
**Files:** New `src/components/layout/NotificationBell.tsx`, migration for `notifications` table
- **Database migration:** Create `notifications` table (id, user_id, title, message, read, created_at) with RLS
- Add bell icon in sidebar/header with unread count badge
- Dropdown showing recent notifications
- Mark as read on click
- Create notifications on: new enrollment, new chat message, class starting soon

## 8. Public Landing Page
**Files:** New `src/pages/Landing.tsx`, modify `src/pages/Index.tsx`, `src/App.tsx`
- Create a landing page with: hero section, feature highlights (Video Classes, Group Chat, Resources), CTA buttons
- Change `Index.tsx` to show Landing when not authenticated, Dashboard when authenticated
- Add `/landing` route as fallback

## Implementation Order
1. Demo mode banner (quick win, improves UX immediately)
2. Schedule join button (small change, high value)
3. Student unenroll + Tutor edit/delete (core missing CRUD)
4. Profile enhancements (bio, subscriptions section)
5. Resource upload (requires storage bucket setup)
6. Landing page (marketing value)
7. Notifications (most complex, best saved for last)

**Database migrations needed:**
- Add `bio` text column and `subjects` text[] column to `profiles`
- Create `notifications` table with RLS policies
- Create storage bucket for resource files and avatar uploads

