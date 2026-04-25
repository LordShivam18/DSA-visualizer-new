# Guided DSA Learning Platform

## System Architecture

The platform is built as an academy layer on top of the existing trace-driven visualizer system.

- Trace engine: problem traces remain the source of truth for algorithm state, explanation, code-line highlights, and animation.
- Timeline control layer: the shared timeline engine now supports locked steps so premium modes can pause progression until a learner action unlocks the next reveal.
- Academy domain model: reusable catalog, learner state, session records, problem progress, topic progress, and adaptive recommendation logic live in `lib/academy`.
- Global platform state: `LearningPlatformProvider` persists learner analytics in `localStorage` using a backend-ready schema.
- Mode hooks: prediction, practice, interview, and progress hooks each manage one learning behavior without coupling it to a specific page.
- Lesson orchestration: a flagship lesson page composes shared academy hooks and shared visualizer components into one paid learning experience.

## Feature Breakdown

### Prediction Mode

- Every next trace step can expose a checkpoint question.
- The timeline locks until the learner submits an answer.
- Feedback explains why the correct step is correct before the learner advances.

### Practice Mode

- The solution stays hidden until the learner submits an attempt or burns hint budget.
- Hints are leveled: direction, logic, reveal.
- Attempts capture strategy choice, final answer, move plan, and confidence.

### Interview Mode

- Timer runs continuously.
- Hint budget is capped.
- Correctness feedback is delayed until submission or timeout.
- Final evaluation scores correctness, efficiency, and confidence separately.

### Progress Tracking

- Every graded session is persisted.
- Problem progress stores mastery, best accuracy, fastest time, mode breakdown, and weak signals.
- Topic progress aggregates attempts, completions, accuracy, and mastery across lessons.

### Adaptive Learning

- Recommendations are derived from weak-topic mastery, current problem context, and catalog difficulty progression.
- The same recommendation rail can be reused on dashboards and lesson pages.

## Folder Structure

```text
app/
  dashboard/page.tsx
  array-string/best-time-to-buy-and-sell-stock-ii/page.tsx
  page.tsx

components/
  academy/
    AcademyDashboard.tsx
    AcademyLessonShell.tsx
    AcademyTopNav.tsx
    AdaptiveRecommendationRail.tsx
    InterviewWorkbench.tsx
    LearningPlatformProvider.tsx
    PracticeWorkbench.tsx
    PredictionCheckpointCard.tsx
    hooks/
      useInterviewMode.ts
      usePracticeMode.ts
      usePredictionEngine.ts
      useProgressTracker.ts
  core/animation/
    TimelineEngine.ts
    useTimeline.ts

lib/
  academy/
    catalog.ts
    models.ts
    recommendations.ts
    storage.ts
```

## Rollout Pattern For More Lessons

1. Add a `ProblemCatalogEntry` in `lib/academy/catalog.ts`.
2. Extend the problem trace with `checkpoint` metadata for prediction mode.
3. Reuse `AcademyLessonShell` and the academy hooks inside the lesson page.
4. Map lesson-specific practice and interview configs.
5. Let `LearningPlatformProvider` persist the resulting sessions automatically.
