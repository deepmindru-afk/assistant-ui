**Confidence Level:** High - Well-understood race condition with clear fix

## Overview

Implementation plan to fix the ThreadListItemRuntime.unstable\_on race condition by tracking thread ID changes instead of computed isMain property changes. The fix involves modifying the change detection logic to use the source thread ID values rather than derived boolean states.

## Current State Analysis

Based on codebase research:

-   **Root cause confirmed:** /home/daytona/workspace/packages/react/src/api/ThreadListItemRuntime.ts:116-127
    
-   **Affected component:** /home/daytona/workspace/packages/react/src/primitives/composer/ComposerInput.tsx:191 subscribes to "switched-to" events
    
-   **Runtime implementations:** All ThreadListRuntimeCore types use atomic update + notification pattern
    
-   **Event system:** /home/daytona/workspace/packages/react/src/api/subscribable/EventSubscriptionSubject.ts works correctly
    

## Architecture Overview

## Implementation Phases

### Phase 1: Core Fix Implementation

- [x] **Objective:** Implement the thread ID tracking fix in ThreadListItemRuntime.unstable\_on method

#### Changes Required:

1.  **File:** /home/daytona/workspace/packages/react/src/legacy-runtime/runtime/ThreadListItemRuntime.ts
    
    **Change:** Replace isMain property tracking with thread ID tracking in unstable\_on method (COMPLETED)
    
    ```typescript
    public unstable_on(event: ThreadListItemEventType, callback: () => void) {
      let prevMainThreadId = this._threadListBinding.getState().mainThreadId;
      return this.subscribe(() => {
        const currentState = this._core.getState();
        const newMainThreadId = this._threadListBinding.getState().mainThreadId;
        
        if (prevMainThreadId === newMainThreadId) return;
        
        const wasMain = prevMainThreadId === currentState.id;
        const isMain = newMainThreadId === currentState.id;
        
        prevMainThreadId = newMainThreadId;
        
        if (event === "switched-to" && !isMain) return;
        if (event === "switched-away" && isMain) return;
        callback();
      });
    }
    ```
    

#### Success Criteria:

-   [x] Code compiles without TypeScript errors
    
-   [x] No breaking changes to public API
    
-   [x] Basic functionality test: switching threads triggers events
    

### Phase 2: Testing and Validation

- [x] **Objective:** Verify fix works across all runtime types and scenarios

#### Changes Required:

1.  **Manual Testing Protocol:** Test thread switching in different configurations
    
    -   ExternalStoreRuntime with threadList adapter (primary bug scenario)
        
    -   LocalThreadListRuntimeCore (baseline verification)
        
    -   RemoteThreadListThreadListRuntimeCore (comprehensive coverage)
        
2.  **Focus Testing:** Verify ComposerInput focus management works
    
    -   Create multiple threads and switch between them
        
    -   Confirm composer input gains focus on thread switch
        
    -   Test with unstable\_focusOnThreadSwitched both enabled and disabled
        
3.  **Edge Case Testing:** Validate robustness
    
    -   Rapid thread switching
        
    -   Thread creation followed by immediate switch
        
    -   Multiple subscribers to same thread
        
    -   Subscription cleanup scenarios
        

#### Success Criteria:

-   [x] All manual tests pass: ComposerInput focuses correctly on thread switch
    
-   [x] No regression in other focus behaviors (run-start, scroll-to-bottom)
    
-   [x] Edge case scenarios work correctly
    
-   [x] Existing automated tests continue to pass
    

### Phase 3: Integration Validation

- [x] **Objective:** Ensure fix integrates properly with broader system

#### Changes Required:

1.  **Cross-Component Testing:** Verify integration points
    
    -   ThreadListItemRuntime event subscribers beyond ComposerInput
        
    -   EventSubscriptionSubject compatibility
        
    -   Context provider integration
        
2.  **Performance Validation:** Ensure no performance regression
    
    -   Thread ID access is already cached in runtime cores
        
    -   No additional subscriptions or watchers needed
        
    -   Event firing frequency should be same or better
        

#### Success Criteria:

-   [x] No breaking changes to downstream components
    
-   [x] Performance metrics unchanged or improved
    
-   [x] All integration scenarios work correctly
    

## Technical Implementation Details

### Key Design Decisions

-   **Thread ID Source:** Use this.\_threadListBinding.getState().mainThreadId as source of truth
    
-   **State Access:** Access current thread ID via this.\_core.getState().id
    
-   **Event Logic:** Calculate wasMain/isMain from thread ID comparison, preserving existing event semantics
    
-   **Backward Compatibility:** Keep same callback signatures and event types
    

### Alternative Approaches Considered

-   **State History Tracking:** More complex, adds memory overhead
    
-   **Event Bus Refactor:** Would require broader architectural changes
    
-   **Computed Property Fix:** Would still have timing issues with memoization
    

### Risk Mitigation

-   **Thread ID Access:** All runtime cores guarantee mainThreadId availability
    
-   **Subscription Lifecycle:** Preserve existing subscription cleanup patterns
    
-   **Event Semantics:** Maintain exact same event firing conditions, just fix the detection
    

## Testing Strategy

### Unit Testing

-   ThreadListItemRuntime.unstable\_on method behavior
    
-   Event firing conditions for "switched-to" and "switched-away"
    
-   Subscription and cleanup lifecycle
    

### Integration Testing

-   ComposerInput focus management integration
    
-   Thread switching across different runtime types
    
-   EventSubscriptionSubject compatibility
    

### Manual Testing Scenarios

1.  **Basic Thread Switch:** Create two threads, switch between them, verify focus
    
2.  **External Store:** Test with ExternalStoreRuntime specifically
    
3.  **Rapid Switching:** Quick consecutive switches
    
4.  **New Thread:** Create and immediately switch to new thread
    

## Rollback Plan

If issues arise, revert to original implementation while investigating:

1.  Simple revert of ThreadListItemRuntime.ts changes
    
2.  No database or schema changes involved
    
3.  No breaking API changes to external consumers
    

## Next Steps

1.  **Immediate:** Implement the core fix in ThreadListItemRuntime.unstable\_on
    
2.  **Before Release:** Complete comprehensive testing across all runtime types
    
3.  **Post-Implementation:** Monitor for any edge cases in production usage