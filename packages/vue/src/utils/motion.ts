/**
 * Centralized re-export of motion-v primitives used by Phase 6 components.
 *
 * Rationale:
 *   - Single import site — easier test mocking
 *   - Single version pin — no drift between Accordion/Disclosure/Toast/Alert
 *   - Explicit surface — accidental use of motion-v features not validated here
 *     shows up as a missing re-export, forcing a deliberate addition.
 *
 * Consumers (D-08, D-10, D-11):
 *   - Accordion height animation
 *   - Toast enter/exit transitions
 *   - Alert dismiss fade + collapse
 */
export { motion, AnimatePresence } from "motion-v";
