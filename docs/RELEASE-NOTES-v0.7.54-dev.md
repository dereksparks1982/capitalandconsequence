# Capital & Consequence v0.7.54-dev: overnight needs and energy

A real campaign transition from Daily Report to the next morning now marks a sleeping/rest boundary in the existing character-needs service. The skipped overnight hours are not silently charged as active starvation/dehydration time. Energy is restored to at least 90, without automatically filling hunger, thirst, or health. Existing low food/water meters carry forward, so the next morning can notify the player rather than making them suffer invisible overnight health damage. This is not a teleport, an automatic meal, free medical care or an extra time clock.

Adds explicit saved calendar model tests for overnight stamina recovery, preservation of hunger/thirst and threshold notifications. No GitHub Actions, map art changes, new assets or accepted Linux package. Visual QA remains pending.
