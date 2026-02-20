<script lang="ts">
    import { useRegisterSW } from "virtual:pwa-register/svelte";
    import { Refresh, X } from "@phosphor-icons/svelte";
    import { cn } from "$lib/utils";

    // Check for updates every hour
    const { needRefresh, updateServiceWorker } = useRegisterSW({
        onRegistered(r: ServiceWorkerRegistration | undefined) {
            r &&
                setInterval(
                    () => {
                        r.update();
                    },
                    60 * 60 * 1000,
                );
        },
    });

    function close() {
        needRefresh.set(false);
    }
</script>

{#if $needRefresh}
    <div
        class="fixed bottom-20 left-4 right-4 z-50 p-4 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300"
        role="alert"
    >
        <div class="flex-1">
            <h3 class="font-bold text-base mb-0.5">Update Available</h3>
            <p class="text-sm text-white/90">
                A new version of Sant Darshan is ready.
            </p>
        </div>

        <div class="flex items-center gap-2">
            <button
                onclick={() => close()}
                class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
                aria-label="Dismiss"
            >
                <X class="w-4 h-4" weight="bold" />
            </button>
            <button
                onclick={() => updateServiceWorker(true)}
                class="px-4 py-2 bg-white text-primary text-sm font-bold rounded-full shadow-sm active:scale-95 transition-transform flex items-center gap-2"
            >
                <Refresh class="w-4 h-4" weight="bold" /> Reload
            </button>
        </div>
    </div>
{/if}
