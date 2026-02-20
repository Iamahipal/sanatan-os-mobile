<script lang="ts">
    import { toast } from "$lib/stores/toast";
    import { fly } from "svelte/transition";
    import { CheckCircle, Info, XCircle } from "@phosphor-icons/svelte";
</script>

<div
    class="absolute top-safe-top inset-x-0 z-[100] flex flex-col items-center gap-2 p-4 pointer-events-none"
>
    {#each $toast as t (t.id)}
        <div
            transition:fly={{ y: -20, duration: 300 }}
            class="flex items-center gap-3 bg-surface shadow-lg border border-gray-100 dark:border-gray-800 rounded-full py-3 px-5 max-w-[90%] pointer-events-auto"
        >
            {#if t.type === "success"}
                <CheckCircle class="w-6 h-6 text-green-500" weight="fill" />
            {:else if t.type === "error"}
                <XCircle class="w-6 h-6 text-red-500" weight="fill" />
            {:else}
                <Info class="w-6 h-6 text-primary" weight="fill" />
            {/if}
            <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
                {t.message}
            </span>
        </div>
    {/each}
</div>
