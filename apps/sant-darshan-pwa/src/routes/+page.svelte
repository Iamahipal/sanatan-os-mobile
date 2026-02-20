<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { streak } from "$lib/stores/user";
    import { type Saint } from "$lib/domain/types";
    import { saints } from "$lib/data";
    import Card from "$lib/components/ui/Card.svelte";
    import ProgressRing from "$lib/components/ui/ProgressRing.svelte";
    import {
        Fire,
        MagnifyingGlass,
        BookOpen,
        Trophy,
        Star,
    } from "@phosphor-icons/svelte";

    // Select daily saint based on the current date string
    let dailySaint = $state<Saint | null>(null);

    onMount(() => {
        // Simple daily hash based on timezone
        const dateString = new Date().toDateString();
        let hash = 0;
        for (let i = 0; i < dateString.length; i++) {
            hash = (Math.imul(31, hash) + dateString.charCodeAt(i)) | 0;
        }

        const index = Math.abs(hash) % saints.length;
        dailySaint = saints[index];
    });

    // Greeting logic based on hour
    const hour = new Date().getHours();
    let greeting = "Namaste";
    if (hour < 12) greeting = "Suprabhat";
    else if (hour < 18) greeting = "Shubh Dophar";
    else greeting = "Shubh Sandhya";

    const quickActions = [
        {
            title: "Explore",
            icon: MagnifyingGlass,
            color: "text-blue-500",
            path: "/explore",
        },
        {
            title: "Journal",
            icon: BookOpen,
            color: "text-purple-500",
            path: "/journal",
        },
        {
            title: "Quizzes",
            icon: Trophy,
            color: "text-yellow-500",
            path: "/quizzes",
        },
        {
            title: "Favorites",
            icon: Star,
            color: "text-orange-500",
            path: "/favorites",
        },
    ];
</script>

<div class="px-4 pt-safe-top pb-8 min-h-full" in:fade={{ duration: 300 }}>
    <!-- Header Area -->
    <header
        class="py-6 flex justify-between items-center"
        in:fly={{ y: -20, duration: 400, delay: 100 }}
    >
        <div>
            <h1
                class="text-2xl font-display font-bold text-gray-900 dark:text-white"
            >
                {greeting}!
            </h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Ready for today's darshan?
            </p>
        </div>

        <!-- Streak Ring Profile -->
        <a href="/profile" class="relative group" aria-label="View Profile">
            <ProgressRing
                progress={Math.min(($streak.current / 7) * 100, 100)}
                size={50}
                strokeWidth={4}
                color="text-orange-500"
            >
                <div
                    class="flex items-center justify-center bg-orange-100 dark:bg-orange-900/40 rounded-full w-9 h-9"
                >
                    <Fire
                        class="w-5 h-5 text-orange-500"
                        weight={$streak.current > 0 ? "fill" : "regular"}
                    />
                </div>
            </ProgressRing>
            {#if $streak.current > 0}
                <div
                    class="absolute -bottom-1 -right-1 bg-surface border border-gray-100 dark:border-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold text-orange-600 shadow-sm"
                >
                    {$streak.current}
                </div>
            {/if}
        </a>
    </header>

    <!-- Daily Darshan Featured Card -->
    <section class="mb-8" in:fly={{ y: 20, duration: 400, delay: 200 }}>
        <h2
            class="text-lg font-bold mb-4 px-1 text-gray-800 dark:text-gray-200"
        >
            Daily Darshan
        </h2>
        {#if dailySaint}
            <Card
                variant="elevated"
                class="p-0 group relative overflow-hidden"
                onclick={() => {
                    /* Navigate to sant detail */
                }}
            >
                <!-- Decorative Background Element -->
                <div
                    class="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"
                ></div>

                <div class="p-6 relative z-10">
                    <div class="flex justify-between items-start mb-4">
                        <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                            {dailySaint.sampradaya || "Sanatan"}
                        </span>
                        <div
                            class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                            <img
                                src={`/images/${dailySaint.image || "default.svg"}`}
                                alt={dailySaint.name.en}
                                class="w-full h-full object-cover"
                                onerror={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                            <!-- Fallback if no image -->
                            <div
                                class="absolute inset-0 flex items-center justify-center text-primary/50 text-xl font-display font-bold select-none -z-10 bg-temple"
                            >
                                {dailySaint.name.en.charAt(0)}
                            </div>
                        </div>
                    </div>

                    <h3
                        class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1"
                    >
                        {dailySaint.name.en}
                    </h3>
                    {#if dailySaint.name.hi}
                        <p
                            class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3"
                        >
                            {dailySaint.name.hi}
                        </p>
                    {/if}

                    <p
                        class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2 leading-relaxed"
                    >
                        {dailySaint.quotes && dailySaint.quotes.length > 0
                            ? `"${dailySaint.quotes[0]}"`
                            : `Learn about the life and teachings of ${dailySaint.name.en}.`}
                    </p>

                    <div
                        class="mt-6 flex items-center text-sm font-semibold text-primary cursor-pointer"
                    >
                        Take Darshan <span
                            class="ml-2 group-hover:translate-x-1 transition-transform"
                            >→</span
                        >
                    </div>
                </div>
            </Card>
        {:else}
            <div
                class="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse w-full"
            ></div>
        {/if}
    </section>

    <!-- Quick Actions Grid -->
    <section in:fly={{ y: 20, duration: 400, delay: 300 }}>
        <h2
            class="text-lg font-bold mb-4 px-1 text-gray-800 dark:text-gray-200"
        >
            Spiritual Journey
        </h2>
        <div class="grid grid-cols-2 gap-4">
            {#each quickActions as action}
                <a href={action.path} class="block h-full cursor-pointer">
                    <Card
                        class="p-4 h-full flex flex-col items-center justify-center text-center gap-3 hover:bg-surface/80 transition-colors"
                    >
                        <div
                            class="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                        >
                            <action.icon
                                class={`w-6 h-6 ${action.color}`}
                                weight="duotone"
                            />
                        </div>
                        <span
                            class="font-medium text-sm text-gray-800 dark:text-gray-200"
                            >{action.title}</span
                        >
                    </Card>
                </a>
            {/each}
        </div>
    </section>
</div>
