// ============================================
// Plugin Spec v1.0 — Production-Grade Contract
// ============================================
//
// This is the OFFICIAL contract for every plugin
// in the MedTach simulation platform.
//
// ═══════════════════════════════════════════
// RULE 1: Execution Boundary
// ═══════════════════════════════════════════
// A plugin MUST declare exactly when it runs.
//
// ✅ canHandle(action) returns true ONLY for
//    actions this plugin is responsible for.
//
// ❌ A plugin MUST NOT handle actions outside
//    its declared domain.
//
// ═══════════════════════════════════════════
// RULE 2: Input Contract
// ═══════════════════════════════════════════
// A plugin receives TWO things:
//   1. Action — the user's request
//   2. SimulationContext — read-only snapshot
//
// ✅ Plugin reads context to make decisions.
// ❌ Plugin MUST NOT modify context directly.
//
// ═══════════════════════════════════════════
// RULE 3: Output Contract
// ═══════════════════════════════════════════
// A plugin returns ActionResult containing:
//   1. success — did it work?
//   2. message — human-readable response
//   3. stateChanges — what changed? (optional)
//   4. events — what to broadcast? (optional)
//
// ✅ Plugin returns stateChanges as a NEW object.
// ❌ Plugin MUST NOT mutate shared state.
//
// ═══════════════════════════════════════════
// RULE 4: Isolation
// ═══════════════════════════════════════════
// A plugin is a PURE unit:
//
// ✅ Stateless — no internal mutable state
// ✅ No plugin-to-plugin communication
// ✅ No direct access to Kernel internals
// ✅ All communication via returned events
//
// ❌ Plugin MUST NOT import another plugin.
// ❌ Plugin MUST NOT access EventBus directly.
// ❌ Plugin MUST NOT access database/filesystem.
//
// ═══════════════════════════════════════════
// RULE 5: Error Handling
// ═══════════════════════════════════════════
// A plugin MUST handle its own errors:
//
// ✅ Return { success: false, message: "..." }
//    for expected errors.
// ✅ Let PluginRuntime catch unexpected errors.
//
// ❌ Plugin MUST NOT throw exceptions for
//    business logic errors.
//
// ═══════════════════════════════════════════
// RULE 6: Performance
// ═══════════════════════════════════════════
// A plugin MUST execute within 5 seconds.
// If it exceeds, PluginRuntime terminates it.
//
// ✅ Synchronous operations preferred.
// ✅ Async only for external data fetching.
//
// ═══════════════════════════════════════════
// RULE 7: Lifecycle
// ═══════════════════════════════════════════
// A plugin MAY implement lifecycle hooks:
//
// onRegister()   — called once when added to Kernel
// onUnregister() — called once when removed
// onReset()      — called when simulation resets
//
// All lifecycle hooks are OPTIONAL.
//

import { PluginContract } from './PluginRuntime';

// ============================================
// Plugin Template — Copy this to create a new plugin
// ============================================

/*
import { Action, ActionResult } from '../core/types';
import { SimulationContext } from '../core/SimulationContext';
import { PluginContract } from '../core/PluginRuntime';

export class MyNewPlugin implements PluginContract {
  name = 'MyNewPlugin';
  version = '1.0.0';
  
  metadata = {
    name: 'MyNewPlugin',
    version: '1.0.0',
    description: 'What this plugin does',
    author: 'Your Name'
  };

  canHandle(action: Action): boolean {
    // Return true ONLY for actions this plugin handles
    return action.type === 'my_type';
  }

  async handle(action: Action, context: SimulationContext): Promise<ActionResult> {
    // 1. Validate input
    if (!action.payload) {
      return { success: false, message: 'No payload provided' };
    }

    // 2. Process (pure logic)
    const result = this.process(action.payload, context);

    // 3. Return result
    return {
      success: true,
      message: result.message,
      stateChanges: result.stateChanges,
      events: result.events
    };
  }

  private process(payload: string, context: SimulationContext): any {
    // Pure function — no side effects
    return {
      message: 'Done',
      stateChanges: {},
      events: []
    };
  }

  onRegister?(): void {
    // Optional: called when plugin is registered
  }

  onUnregister?(): void {
    // Optional: called when plugin is removed
  }

  onReset?(): void {
    // Optional: called when simulation resets
  }
}
*/

// ============================================
// Plugin Validation Checklist
// ============================================
//
// Before deploying a plugin, verify:
//
// ✅ implements PluginContract
// ✅ has name and version
// ✅ canHandle() is deterministic
// ✅ handle() is pure (no side effects)
// ✅ returns ActionResult for all paths
// ✅ no imports from other plugins
// ✅ no direct state mutation
// ✅ handles empty/null inputs
// ✅ execution under 5 seconds
// ✅ tested in isolation

export const PLUGIN_SPEC_VERSION = '1.0.0';
