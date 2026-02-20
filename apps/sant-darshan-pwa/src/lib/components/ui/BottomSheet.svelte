<script lang="ts">
    import { cn } from "$lib/utils";
    import { fade, fly } from "svelte/transition";
    import type { Snippet } from "svelte";
    import { X } from "@phosphor-icons/svelte";

    let {
        open = $bindable(false),
        title = "",
        class: className = "",
        children,
    }: {
        open: boolean;
        title?: string;
        class?: string;
        children: Snippet;
    } = $props();

    function close() {
        open = false;
    }
</script>

{#if open}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- Backdrop -->
    <div
        class="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={close}
    ></div>

    <!-- Sheet -->
    <div
        class={cn(
            "absolute bottom-0 left-0 right-0 z-50 bg-surface rounded-t-[32px] pt-4 pb-12 shadow-2xl flex flex-col max-h-[90dvh]",
            className,
        )}
        transition:fly={{ y: "100%", duration: 300, opacity: 1 }}
    >
        <!-- Handle -->
        <div
            class="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"
        ></div>

        {#if title}
            <div class="px-6 flex items-center justify-between mb-2 shrink-0">
                <h2
                    class="text-xl font-display font-bold text-gray-900 dark:text-white"
                >
                    {title}
                </h2>
                <button
                    class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    onclick={close}
                    aria-label="Close"
                >
                    <X weight="bold" class="w-5 h-5" />
                </button>
            </div>
        {/if}

        <div class="px-6 overflow-y-auto overscroll-contain flex-1">
            {@render children()}
        </div>
    </div>
{/if}
