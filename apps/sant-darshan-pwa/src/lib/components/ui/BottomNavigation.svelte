<script lang="ts">
    import { page } from "$app/stores";
    import {
        House,
        MagnifyingGlass,
        BookOpen,
        User,
    } from "phosphor-svelte";
    import { cn } from "$lib/utils";

    // Determine active tab based on current route
    let activePath = $derived($page.url.pathname);

    const tabs = [
        { id: "home", path: "/", label: "Darshan", icon: House },
        {
            id: "explore",
            path: "/explore",
            label: "Explore",
            icon: MagnifyingGlass,
        },
        { id: "journal", path: "/journal", label: "Journal", icon: BookOpen },
        { id: "profile", path: "/profile", label: "Profile", icon: User },
    ];
</script>

<nav
    class="absolute bottom-0 inset-x-0 h-[var(--safe-area-bottom,80px)] bg-surface border-t border-gray-100 dark:border-gray-800 z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
>
    <div class="flex h-16 items-center justify-around px-2">
        {#each tabs as tab}
            {@const isActive =
                activePath === tab.path ||
                (tab.path !== "/" && activePath.startsWith(tab.path))}
            <a
                href={tab.path}
                class="relative flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors duration-200"
                aria-label={tab.label}
            >
                <div
                    class={cn(
                        "relative flex items-center justify-center transition-all duration-300",
                        isActive
                            ? "text-primary scale-110"
                            : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300",
                    )}
                >
                    {#if isActive}
                        <div
                            class="absolute inset-0 bg-primary/10 rounded-full scale-150 transition-all"
                        ></div>
                    {/if}
                    <tab.icon
                        weight={isActive ? "fill" : "regular"}
                        class="w-6 h-6 z-10"
                    />
                </div>
                <!-- Optional: Text label for clarity -->
                <span
                    class={cn(
                        "text-[10px] font-medium transition-colors",
                        isActive
                            ? "text-primary"
                            : "text-gray-400 dark:text-gray-500",
                    )}
                >
                    {tab.label}
                </span>
            </a>
        {/each}
    </div>
</nav>
