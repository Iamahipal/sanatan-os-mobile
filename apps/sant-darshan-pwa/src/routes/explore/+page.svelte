<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { searchEngine } from "$lib/services/SearchService";
    import { saints, traditions } from "$lib/data";
    import type { Saint } from "$lib/domain/types";
    import { MagnifyingGlass, Funnel, MapPin } from "phosphor-svelte";
    import Card from "$lib/components/ui/Card.svelte";

    let query = $state("");
    let activeTradition = $state("all");
    let searchResults = $state<Saint[]>([]);

    // Sort saints alphabetically by default
    const allSaints = [...saints].sort((a, b) =>
        a.name.en.localeCompare(b.name.en),
    );

    onMount(() => {
        // Ensure data is indexed for search
        searchEngine.indexData(saints);
        searchResults = allSaints;
    });

    // Reactive search effect
    $effect(() => {
        if (!query.trim() && activeTradition === "all") {
            searchResults = allSaints;
        } else if (!query.trim() && activeTradition !== "all") {
            searchResults = allSaints.filter(
                (s) => s.traditionId === activeTradition,
            );
        } else {
            // MiniSearch returns IDs and matched fields, map back to standard Saint objects
            const results = searchEngine.search(query, activeTradition);
            searchResults = results
                .map((r) => saints.find((s) => s.id === r.id))
                .filter(Boolean) as Saint[];
        }
    });
</script>

<div class="min-h-full bg-surface" in:fade={{ duration: 300 }}>
    <!-- Sticky Header & Search -->
    <header
        class="sticky top-0 z-30 bg-surface/90 backdrop-blur-md pt-safe-top px-4 pb-4 border-b border-gray-100 dark:border-gray-800 shadow-sm"
    >
        <div class="mt-4 flex items-center gap-3">
            <div class="relative flex-1">
                <MagnifyingGlass
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <input
                    type="text"
                    bind:value={query}
                    placeholder="Search saints, places, teachings..."
                    class="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                />
            </div>
            <button
                class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 active:scale-95 transition-transform"
                aria-label="Filters"
            >
                <Funnel class="w-5 h-5" weight="bold" />
            </button>
        </div>

        <!-- Horizontal Tradition Filters -->
        <div class="mt-4 flex overflow-x-auto hide-scrollbar gap-2 pb-1">
            <button
                class={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTradition === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
                onclick={() => (activeTradition = "all")}
            >
                All Paths
            </button>
            {#each traditions as tradition}
                <button
                    class={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center`}
                    style={activeTradition === tradition.id
                        ? `background-color: ${tradition.color}; color: white;`
                        : ""}
                    class:bg-gray-100={activeTradition !== tradition.id}
                    class:text-gray-600={activeTradition !== tradition.id}
                    class:dark:bg-gray-800={activeTradition !== tradition.id}
                    class:dark:text-gray-300={activeTradition !== tradition.id}
                    onclick={() => (activeTradition = tradition.id)}
                >
                    {tradition.name}
                </button>
            {/each}
        </div>
    </header>

    <!-- Results List -->
    <main class="px-4 py-6 pb-24">
        <p class="text-sm text-gray-500 font-medium mb-4">
            {searchResults.length} Saints found
        </p>

        <div class="grid grid-cols-1 gap-4">
            {#each searchResults as saint (saint.id)}
                <a
                    href={`/darshan/${saint.id}`}
                    class="block group cursor-pointer"
                    in:fly={{ y: 20, duration: 300 }}
                >
                    <Card
                        class="flex items-center gap-4 p-4 hover:shadow-md transition-shadow"
                    >
                        <div
                            class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700"
                        >
                            <img
                                src={`/images/${saint.image || "default.svg"}`}
                                alt={saint.name.en}
                                class="w-full h-full object-cover"
                                onerror={(e) => {
                                    (
                                        e.currentTarget as HTMLImageElement
                                    ).style.display = "none";
                                }}
                            />
                            {#if !saint.image}
                                <div
                                    class="w-full h-full flex items-center justify-center text-primary/50 text-xl font-display font-bold bg-temple"
                                >
                                    {saint.name.en.charAt(0)}
                                </div>
                            {/if}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3
                                class="text-lg font-bold text-gray-900 dark:text-white truncate"
                            >
                                {saint.name.en}
                            </h3>
                            <div
                                class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1"
                            >
                                <span
                                    class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full truncate"
                                    >{saint.sampradaya ||
                                        traditions.find(
                                            (t) => t.id === saint.traditionId,
                                        )?.name ||
                                        "Sanatan"}</span
                                >
                                {#if saint.period && !saint.period.includes("Mythological")}
                                    <span class="truncate"
                                        >{saint.period.split(/[–-]/)[0]}</span
                                    >
                                {/if}
                            </div>
                        </div>
                    </Card>
                </a>
            {:else}
                <div class="text-center py-12 px-4">
                    <div
                        class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"
                    >
                        <MagnifyingGlass class="w-8 h-8" />
                    </div>
                    <h3
                        class="text-lg font-bold text-gray-900 dark:text-white mb-2"
                    >
                        No saints found
                    </h3>
                    <p class="text-gray-500">
                        Try adjusting your search or filters to find what you're
                        looking for.
                    </p>
                </div>
            {/each}
        </div>
    </main>
</div>

<style>
    /* Hide scrollbar for clean filter chips */
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
