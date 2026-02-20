<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { saints, traditions } from "$lib/data";
    import { favorites, toggleFavorite, markExplored } from "$lib/stores/user";
    import { toast } from "$lib/stores/toast";
    import {
        Heart,
        CaretLeft,
        ShareNetwork,
        MapPin,
        Quotes,
        HandsPraying,
    } from "@phosphor-icons/svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";

    let { data } = $props();
    const saint = $derived(data.saint);
    const tradition = $derived(
        traditions.find((t) => t.id === saint.traditionId),
    );

    let isFavorite = $derived($favorites.has(saint.id));

    let activeTab = $state("teachings"); // 'teachings', 'life', 'works'

    onMount(() => {
        // Mark as explored when visiting the page
        markExplored(saint.id);
    });

    async function handleFavorite() {
        await toggleFavorite(saint.id);
        toast.add(
            isFavorite
                ? `Removed from Favorites`
                : `Added ${saint.name.en} to Favorites`,
            "success",
        );
    }

    async function handleShare() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Sant Darshan: ${saint.name.en}`,
                    text: `Read about ${saint.name.en} and their teachings on Sant Darshan.`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Error sharing", err);
            }
        } else {
            toast.add("Sharing not supported on this browser", "info");
        }
    }
</script>

<div class="min-h-full bg-surface pb-24" in:fade={{ duration: 300 }}>
    <!-- Header with Image & Back Button -->
    <header
        class="relative h-72 rounded-b-[40px] shadow-sm overflow-hidden bg-temple shrink-0"
    >
        <!-- Floating Actions -->
        <div
            class="absolute top-safe-top left-4 right-4 z-20 flex justify-between items-center"
        >
            <button
                class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
                onclick={() => history.back()}
                aria-label="Back"
            >
                <CaretLeft class="w-6 h-6" weight="bold" />
            </button>
            <div class="flex gap-2">
                <button
                    class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
                    onclick={handleShare}
                    aria-label="Share"
                >
                    <ShareNetwork class="w-5 h-5" weight="fill" />
                </button>
                <button
                    class="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center active:scale-95 transition-all {isFavorite
                        ? 'bg-white text-red-500 shadow-lg scale-110'
                        : 'bg-white/20 text-white'}"
                    onclick={handleFavorite}
                    aria-label="Favorite"
                >
                    <Heart
                        class="w-5 h-5"
                        weight={isFavorite ? "fill" : "bold"}
                    />
                </button>
            </div>
        </div>

        <!-- Image Content -->
        <div class="absolute inset-0">
            {#if saint.image}
                <img
                    src={`/images/${saint.image}`}
                    alt={saint.name.en}
                    class="w-full h-full object-cover"
                    onerror={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                ></div>
            {:else}
                <div
                    class="absolute inset-0 bg-gradient-to-br from-primary to-orange-500"
                ></div>
                <div
                    class="absolute inset-0 flex items-center justify-center opacity-20"
                >
                    <HandsPraying
                        class="w-32 h-32 text-white"
                        weight="duotone"
                    />
                </div>
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                ></div>
            {/if}
        </div>

        <!-- Title Area -->
        <div class="absolute bottom-6 left-6 right-6 z-10">
            <div class="flex items-center gap-2 mb-2">
                {#if tradition}
                    <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30"
                    >
                        {tradition.name}
                    </span>
                {/if}
                {#if saint.sampradaya}
                    <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white/90 border border-white/10"
                    >
                        {saint.sampradaya}
                    </span>
                {/if}
            </div>
            <h1
                class="text-3xl font-display font-bold text-white mb-1 shadow-black"
            >
                {saint.name.en}
            </h1>
            {#if saint.name.hi || saint.period}
                <p class="text-sm text-white/80 font-medium">
                    {saint.name.hi ? saint.name.hi + " • " : ""}
                    {saint.period ? saint.period.split(/[–-]/)[0] : ""}
                </p>
            {/if}
        </div>
    </header>

    <!-- Main Content -->
    <main class="px-5 py-6">
        <!-- Tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-1">
            <button
                class="px-5 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap {activeTab ===
                'teachings'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}"
                onclick={() => (activeTab = "teachings")}
            >
                Quotes & Teachings
            </button>
            <button
                class="px-5 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap {activeTab ===
                'life'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}"
                onclick={() => (activeTab = "life")}
            >
                Life Story
            </button>
            {#if saint.works && saint.works.length > 0}
                <button
                    class="px-5 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap {activeTab ===
                    'works'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}"
                    onclick={() => (activeTab = "works")}
                >
                    Works
                </button>
            {/if}
        </div>

        <!-- Tab Content -->
        <div in:fade={{ duration: 200 }} class="min-h-[300px]">
            {#if activeTab === "teachings"}
                <div class="space-y-4">
                    {#if saint.quotes && saint.quotes.length > 0}
                        {#each saint.quotes as quote, i}
                            <Card
                                variant="glass"
                                class="p-6 relative bg-temple/10 border-primary/10"
                            >
                                <Quotes
                                    class="w-8 h-8 text-primary/20 absolute top-4 left-4"
                                    weight="fill"
                                />
                                <p
                                    class="text-base text-gray-800 dark:text-gray-200 mt-4 leading-relaxed font-medium italic relative z-10 pl-2 border-l-2 border-primary/30"
                                >
                                    "{quote.replace(/^["'\s]+|["'\s]+$/g, "")}"
                                </p>
                            </Card>
                        {/each}
                    {:else}
                        <Card
                            class="p-8 text-center bg-gray-50 dark:bg-gray-800/50"
                        >
                            <HandsPraying
                                class="w-10 h-10 mx-auto text-gray-400 mb-3"
                            />
                            <p class="text-gray-500 font-medium">
                                Teachings of {saint.name.en} inspire countless seekers.
                            </p>
                        </Card>
                    {/if}
                </div>
            {:else if activeTab === "life"}
                <Card class="p-6">
                    <p
                        class="text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                        Data for the full biography will be populated from Phase
                        2 stories soon. {saint.name.en} belonged to the {saint.sampradaya ||
                            "Sanatan"} tradition, living during {saint.period}.
                    </p>
                </Card>
            {:else if activeTab === "works"}
                <div class="space-y-3">
                    {#if saint.works}
                        {#each saint.works as work}
                            <Card class="p-4 flex items-center gap-3">
                                <BookOpen
                                    class="w-5 h-5 text-primary"
                                    weight="duotone"
                                />
                                <span
                                    class="font-medium text-gray-800 dark:text-gray-200"
                                    >{work}</span
                                >
                            </Card>
                        {/each}
                    {/if}
                </div>
            {/if}
        </div>
    </main>
</div>

<style>
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
