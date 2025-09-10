**Completeness Level:** Complete

## Overview

Fix a race condition bug in ThreadListItemRuntime's unstable\_on method that prevents composer input from gaining focus when switching threads using ExternalStoreRuntime with threadList adapter. The bug occurs because the method tracks isMain state changes, but by the time subscribers are notified, the state has already been updated atomically, causing change detection to fail.

## Context

-   **Existing System State:** ThreadListItemRuntime.unstable\_on method tracks isMain property changes to trigger "switched-to" and "switched-away" events, but atomic state updates cause race conditions
    
-   **Gap Being Addressed:** ComposerInput doesn't receive focus when switching threads because "switched-to" events are never fired due to failed change detection
    
-   **User-Provided Fix:** Track thread ID changes instead of isMain changes to avoid the race condition
    

## Functional Requirements

### Core Bug Fix Requirements

**REQ-001:** The ThreadListItemRuntime.unstable\_on method shall reliably detect thread switching events across all runtime types

_Rationale:_ Current implementation fails to detect changes due to atomic state updates, preventing focus management from working

-   Acceptance: "switched-to" events fire when a thread becomes the main thread
    
-   Acceptance: "switched-away" events fire when a thread stops being the main thread
    
-   Acceptance: Works consistently across LocalThreadListRuntimeCore, ExternalStoreThreadListRuntimeCore, and RemoteThreadListThreadListRuntimeCore
    

**REQ-002:** The system shall track thread ID changes instead of computed isMain property changes to avoid race conditions

_Rationale:_ Thread ID is the source of truth and is stored directly, eliminating timing issues with computed properties

-   Acceptance: Change detection uses mainThreadId from ThreadListRuntimeCore
    
-   Acceptance: Previous thread ID is captured before subscription callback executes
    
-   Acceptance: Event determination is based on comparison between current thread ID and previous/new main thread IDs
    

### Focus Management Requirements

**REQ-003:** When a user switches to a thread, the composer input shall automatically gain focus

_Rationale:_ This is the primary user-visible issue - composers don't focus after thread switches

-   Acceptance: ComposerInput receives "switched-to" events and focuses accordingly
    
-   Acceptance: Focus behavior works with unstable\_focusOnThreadSwitched prop enabled
    
-   Acceptance: No regression in other focus scenarios (run-start, scroll-to-bottom)
    

### Compatibility Requirements

**REQ-004:** The fix shall maintain backward compatibility with existing unstable\_on event subscriptions

_Rationale:_ Other parts of the system may depend on "switched-to" and "switched-away" events

-   Acceptance: Existing event callback signatures remain unchanged
    
-   Acceptance: Event timing and frequency are preserved or improved
    
-   Acceptance: No breaking changes to ThreadListItemRuntime public API
    

## Technical Analysis

### Root Cause

The bug exists in /home/daytona/workspace/packages/react/src/api/ThreadListItemRuntime.ts lines 116-127:

```typescript
public unstable_on(event: ThreadListItemEventType, callback: () => void) {
  let prevIsMain = this._core.getState().isMain;  // ← Captured at subscription
  return this.subscribe(() => {
    const newIsMain = this._core.getState().isMain;  // ← Read after atomic update
    if (prevIsMain === newIsMain) return;  // ← Always true due to race condition
    prevIsMain = newIsMain;
    
    if (event === "switched-to" && !newIsMain) return;
    if (event === "switched-away" && newIsMain) return;
    callback();
  });
}
```

### Race Condition Mechanism

The issue occurs because:

1.  **Atomic Updates:** Runtime cores update mainThreadId and call \_notifySubscribers() atomically
    
2.  **Computed State:** isMain property is computed as threadData.threadId === threadList.mainThreadId
    
3.  **Memoized Sync:** ShallowMemoizeSubject synchronizes state before notifying subscribers
    
4.  **Timing Issue:** By callback execution time, both prevIsMain and newIsMain reflect the updated state
    

### Affected Components

-   **Primary:** ComposerInput.tsx:191 - subscribes to "switched-to" events
    
-   **Runtime Cores:** All ThreadListRuntimeCore implementations affected equally
    
-   **Event System:** EventSubscriptionSubject and related infrastructure works correctly
    

## System Flow

## Edge Cases

-   **Rapid Thread Switching:** Multiple quick switches should each trigger appropriate events
    
-   **Thread Creation:** New thread creation and immediate switch should work correctly
    
-   **External Store Updates:** External state changes should be handled properly
    
-   **Subscription Cleanup:** Unsubscribed listeners shouldn't receive events
    

## Success Criteria

-   ComposerInput gains focus when switching threads in all runtime types
    
-   Thread switching events fire reliably without race conditions
    
-   No regression in existing focus management features
    
-   All existing unit tests continue to pass
    
-   Manual testing confirms fix works in practice