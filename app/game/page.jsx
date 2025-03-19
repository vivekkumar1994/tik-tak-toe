// app/game/page.js or wherever your component is located
"use client"; // Ensure this is a Client Component

import React, { Suspense } from "react";
import {GameComponent} from "@/app/components/game"; // Assuming Game component uses useSearchParams

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameComponent />
    </Suspense>
  );
}
