# Guided DSA Learning Platform

## 1. Feature Design

### Why panel

- The why panel remains step-driven, but now contrasts the current move with the most tempting wrong alternative.
- Explanations are derived from the active trace step, so the panel stays dynamic as the timeline advances.
- The panel now answers three questions at once: what happened, why now, and what alternative would only be correct under different evidence.

### Mistake detection

- Wrong prediction answers are diagnosed against reusable reasoning-pattern rules in `lib/academy/mistakeEngine.ts`.
- When the learner has not answered yet, the lesson still shows a "most likely trap" preview for the current step.
- Feedback is step-local, not generic: inspection mistakes differ from commit mistakes and from finish-line mistakes.

### Guided learning path

- Every lesson resolves its registry entry from `problemRegistry`, then builds a local progression track from neighboring problems in the same category.
- The path panel shows the current lesson, the immediate next rep, and the stretch rep without inventing a second catalog.
- Adaptive recommendations remain the personal layer on top of the registry-ordered track.

### Replay with variations

- Lessons now offer replay buttons for edge cases, random cases, and mutated current cases.
- Variation generation is centralized in `lib/academy/variationEngine.ts` so replay logic is not duplicated inside pages.
- Current implementations are tailored for `Best Time to Buy and Sell Stock II`, `Zigzag Conversion`, and `Word Search`, with generic array fallbacks for other lessons.

### Pattern recognition panel

- Pattern guidance is derived from `problemRegistry.taxonomy` and `problemRegistry.tags`.
- Each lesson now explains the primary pattern, when to use it, what to watch for, and which similar problems reinforce the same pattern.
- Similar-problem suggestions are ranked from registry overlap instead of hand-maintained duplicates.

### Learning intelligence UI

- The lesson-level intelligence panel converts progress, prediction accuracy, why-state, and recommendations into three concrete actions: what to do now, what variation to run next, and what problem to open afterward.
- The dashboard copy has been reframed around free guided learning rather than monetization.

### Narrative animation layer

- Each step now gets a lightweight teaching rhythm: focus, explain, animate.
- This lives above the trace explanation and is driven by step changes, not by a second timeline engine.
- The existing timeline system remains the source of truth for step order and visual state.

## 2. Integration Plan

### LessonShell integration

- `components/academy/LessonShell.tsx` is the single integration point.
- It now composes:
  - `NarrativeAnimationLayer`
  - `WhyPanel`
  - `MistakeDetectionPanel`
  - `PatternRecognitionPanel`
  - `GuidedLearningPathPanel`
  - `ReplayVariationsPanel`
  - `LearningIntelligencePanel`
- Existing lesson pages keep their visualizer, microscope, trace panel, and code panel contracts intact.

### Data flow

- `problemRegistry` stays the canonical lesson source.
- `useLessonLearningExperience` resolves the current route back to the registry and builds:
  - pattern insight
  - guided path
  - replay variations
  - lesson intelligence
  - mistake insight
- `whyEngine` and `mistakeEngine` were extended rather than replaced, so prior logic still works.

### Timeline safety

- No changes were made to the ordering or mutation behavior of the shared timeline engine.
- The narrative layer is observational.
- Prediction locks still come from the existing `usePredictionEngine` plus `TimelineEngine.setLockedSteps`.

## 3. Code Modules

### Core engines

1. `lib/academy/patternEngine.ts`
   Builds pattern recognition from `problemRegistry`.
2. `lib/academy/learningPathEngine.ts`
   Builds structured lesson progression and next-step slots.
3. `lib/academy/variationEngine.ts`
   Generates edge, random, and mutation replay inputs.
4. `lib/academy/lessonCoachEngine.ts`
   Turns progress and current-step state into actionable study advice.

### Hook

5. `components/academy/hooks/useLessonLearningExperience.ts`
   Central hook that resolves the active problem and assembles all lesson intelligence data.

### UI panels

6. `components/academy/NarrativeAnimationLayer.tsx`
7. `components/academy/MistakeDetectionPanel.tsx`
8. `components/academy/PatternRecognitionPanel.tsx`
9. `components/academy/GuidedLearningPathPanel.tsx`
10. `components/academy/ReplayVariationsPanel.tsx`
11. `components/academy/LearningIntelligencePanel.tsx`

### Extended existing modules

12. `lib/academy/whyEngine.ts`
    Adds per-step alternatives.
13. `lib/academy/mistakeEngine.ts`
    Adds pre-answer trap previews.
14. `components/academy/WhyPanel.tsx`
    Renders the new alternatives block.
15. `components/academy/LessonShell.tsx`
    Composes the full guided learning stack without changing page-level lesson code.
