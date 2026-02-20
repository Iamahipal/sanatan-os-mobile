<script lang="ts">
    import { cn } from "$lib/utils";

    let {
        progress = 0,
        size = 120,
        strokeWidth = 8,
        color = "text-primary",
        trackColor = "text-primary/20",
        class: className = "",
        children,
    } = $props();

    // Calculate circle path
    let radius = $derived((size - strokeWidth) / 2);
    let circumference = $derived(radius * 2 * Math.PI);

    // Derived value for dash offset
    let offset = $derived(circumference - (progress / 100) * circumference);
</script>

<div
    class={cn("relative inline-flex items-center justify-center", className)}
    style="width: {size}px; height: {size}px;"
>
    <!-- Background Track -->
    <svg class="w-full h-full transform -rotate-90" width={size} height={size}>
        <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            stroke-width={strokeWidth}
            fill="transparent"
            class={cn("transition-all duration-300", trackColor)}
        />

        <!-- Progress Ring -->
        <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            stroke-width={strokeWidth}
            fill="transparent"
            stroke-dasharray={circumference}
            stroke-dashoffset={offset}
            stroke-linecap="round"
            class={cn("transition-all duration-1000 ease-out", color)}
        />
    </svg>

    <!-- Center Content -->
    {#if children}
        <div class="absolute inset-0 flex items-center justify-center">
            {@render children()}
        </div>
    {/if}
</div>
