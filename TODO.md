# Personal Finance App Improvements Checklist

- [x] **Feature 1: Quick Preset Templates (เทมเพลตธุรกรรมด่วน)**
  - [x] Write unit tests for preset utility functions (`src/utils/presets.test.ts`)
  - [x] Implement preset helper logic and templates (`src/utils/presets.ts`)
  - [x] Create UI for Quick Preset Buttons inside the Dashboard (`src/components/QuickPresets.tsx`)
  - [x] Integrate Quick Presets into the main flow in `src/App.tsx` and `src/components/DashboardTab.tsx`
  - [x] Refactor & optimize preset data structures and efficiency
- [x] **Feature 2: Monthly Savings Goal Tracker (เป้าหมายเงินออมรายเดือน)**
  - [x] Write unit tests for savings goals calculations (`src/utils/savings.test.ts`)
  - [x] Implement savings calculations & status helper (`src/utils/savings.ts`)
  - [x] Create UI widget for Savings Tracker in Dashboard (`src/components/SavingsTracker.tsx`)
  - [x] Add editable Savings Target input in Settings Modal (`src/components/SettingsModal.tsx`)
  - [x] Refactor & optimize state propagation
- [x] **Feature 3: Financial Insights & Smart Alerts (วิเคราะห์การเงินอัจฉริยะ)**
  - [x] Write unit tests for insight generation helpers (`src/utils/insights.test.ts`)
  - [x] Implement algorithms to find top spending category and warning rules (`src/utils/insights.ts`)
  - [x] Create Insights component and integrate on Dashboard (`src/components/InsightsPanel.tsx`)
  - [x] Refactor & optimize rule execution

- [x] **Feature 4: Data Backup & Portability (การสำรองและนำเข้าข้อมูล และระบบรีเซ็ต)**
  - [x] Write unit tests for CSV/JSON serialization and data validation (`src/utils/backup.test.ts`)
  - [x] Implement export/import helper functions and schema validation (`src/utils/backup.ts`)
  - [x] Update Settings Modal UI with Backup, Import, and Reset actions (`src/components/SettingsModal.tsx`)
  - [x] Integrate file download/upload handlers in `src/App.tsx`
  - [x] Refactor & optimize data import error handling and flow

- [x] **Feature 5: Subscriptions & Recurring Bills Manager (จัดการบริการสมาชิกและบิลรายเดือน)**
  - [x] Write unit tests for subscription cost aggregation and due calculations (`src/utils/recurring.test.ts`)
  - [x] Implement recurring bill state structures and helper logic (`src/utils/recurring.ts`)
  - [x] Create UI widget for Subscriptions & Recurring Bills on Dashboard (`src/components/RecurringBills.tsx`)
  - [x] Add editable Subscription creator/manager inside Settings Modal (`src/components/SettingsModal.tsx`)
  - [x] Refactor & optimize subscription state and storage mapping

- [x] **Feature 6: Recurring Bill Calendar Grid (ปฏิทินบิลรายเดือน)**
  - [x] Write unit tests for calendar day events matching (`src/utils/calendar.test.ts`)
  - [x] Implement helper to calculate which days have recurring bills (`src/utils/calendar.ts`)
  - [x] Create UI component for Monthly Bill Calendar grid inside the new Tab (`src/components/BillsCalendar.tsx`)
  - [x] Integrate interactive calendar selection to see details of bills due on that day
  - [x] Refactor & optimize performance of date/event mapping

- [x] **Feature 7: Dynamic Pagination, Searching & Sorting (ระบบเลื่อนหน้าสลับขยับหน้าเว็บ, ค้นหา และคัดกรองจัดเรียงลำดับสะดวกรวดเร็ว)**
  - [x] Write unit tests for dynamic list pagination, filtering, and sorting (`src/utils/pagination.test.ts`)
  - [x] Implement generic utility helpers for list pagination, searching, and sorting (`src/utils/pagination.ts`)
  - [x] Integrate dynamic paginated list, adjustable items per page, search, and dual-axis sorting in Transactions view (`src/components/TransactionsTab.tsx`)
  - [x] Add real-time text searching, category matching, active status toggling, and page-based paging inside Recurring Bills view (`src/components/RecurringBills.tsx`)
  - [x] Refactor and optimize overall page layout state synchronization





