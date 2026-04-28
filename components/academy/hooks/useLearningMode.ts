"use client";

import { useCallback, useMemo } from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  resolveLessonEntryExperience,
  type LessonEntryExperience,
} from "@/lib/academy/entryPoints";

export function useLearningMode() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryMode = searchParams.get("mode");
  const legacyEntryMode = searchParams.get("entry");
  const learningMode = useMemo(
    () => resolveLessonEntryExperience(queryMode ?? legacyEntryMode),
    [legacyEntryMode, queryMode]
  );

  const setLearningMode = useCallback((nextMode: LessonEntryExperience) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("entry");

    if (nextMode === "explore") {
      nextSearchParams.delete("mode");
    } else {
      nextSearchParams.set("mode", nextMode);
    }

    const query = nextSearchParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  return {
    learningMode,
    isReady: true,
    setLearningMode,
  };
}
