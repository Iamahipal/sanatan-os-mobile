<script lang="ts">
    import { cn } from "$lib/utils";
    import type { Snippet } from "svelte";

    type CardVariant = "default" | "elevated" | "glass";

    let {
        variant = "default",
        class: className = "",
        children,
        onclick,
    }: {
        variant?: CardVariant;
        class?: string;
        children: Snippet;
        onclick?: (event: MouseEvent) => void;
    } = $props();

    const variants = {
        default: "bg-surface border border-gray-100 dark:border-gray-800",
        elevated:
            "bg-surface shadow-md shadow-gray-200/50 dark:shadow-black/50 border border-transparent",
        glass: "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/20 dark:border-white/10",
    };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class={cn(
        "rounded-[28px] overflow-hidden transition-all duration-300", // Apple-like super rounded corners
        onclick ? "cursor-pointer active:scale-[0.98]" : "",
        variants[variant],
        className,
    )}
    {onclick}
>
    {@render children()}
</div>
