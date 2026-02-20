<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { db, type JournalEntry } from "$lib/services/StorageService";
    import { toast } from "$lib/stores/toast";
    import { saints } from "$lib/data";
    import { JOURNAL_PROMPTS } from "$lib/data/phase2-data";
    import { BookOpen, Calendar, Plus, PenNib } from "@phosphor-icons/svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import BottomSheet from "$lib/components/ui/BottomSheet.svelte";

    let entries = $state<JournalEntry[]>([]);
    let isEditorOpen = $state(false);

    // Editor State
    let currentEntryId = $state<number | null>(null);
    let entryText = $state("");
    let selectedPrompt = $state("");
    let relatedSaintId = $state("");

    onMount(async () => {
        await loadEntries();
    });

    async function loadEntries() {
        // Load sorted by date desc
        entries = await db.journal.orderBy("timestamp").reverse().toArray();
    }

    function openEditor(entry?: JournalEntry) {
        if (entry) {
            currentEntryId = entry.id || null;
            entryText = entry.text;
            selectedPrompt = entry.prompt;
            relatedSaintId = entry.saintId || "";
        } else {
            currentEntryId = null;
            entryText = "";
            relatedSaintId = "";
            // Pick a random prompt
            selectedPrompt =
                JOURNAL_PROMPTS[
                    Math.floor(Math.random() * JOURNAL_PROMPTS.length)
                ];
        }
        isEditorOpen = true;
    }

    async function saveEntry() {
        if (!entryText.trim()) {
            toast.add("Journal entry cannot be empty", "error");
            return;
        }

        const now = Date.now();
        const dateObj = new Date();
        const dateString = dateObj.toISOString().split("T")[0];

        try {
            if (currentEntryId) {
                await db.journal.update(currentEntryId, {
                    text: entryText,
                    saintId: relatedSaintId,
                    timestamp: now, // Update timestamp to bump it to top
                });
                toast.add("Journal entry updated", "success");
            } else {
                await db.journal.add({
                    date: dateString,
                    saintId: relatedSaintId,
                    prompt: selectedPrompt,
                    text: entryText,
                    timestamp: now,
                });
                toast.add("Journal entry saved", "success");
            }
            isEditorOpen = false;
            await loadEntries();
        } catch (e) {
            toast.add("Failed to save journal entry", "error");
            console.error(e);
        }
    }
</script>

<div class="min-h-full bg-surface" in:fade={{ duration: 300 }}>
    <!-- Header -->
    <header
        class="pt-safe-top px-4 py-4 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-30 bg-surface/90 backdrop-blur-md"
    >
        <div class="flex justify-between items-center mt-2">
            <div>
                <h1
                    class="text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2"
                >
                    <BookOpen class="w-6 h-6 text-primary" weight="duotone" /> Spiritual
                    Journal
                </h1>
                <p class="text-sm text-gray-500 font-medium">
                    Reflect on your journey
                </p>
            </div>
            <button
                class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                onclick={() => openEditor()}
                aria-label="New Entry"
            >
                <Plus class="w-5 h-5" weight="bold" />
            </button>
        </div>
    </header>

    <!-- Entries List -->
    <main class="px-4 py-6 pb-24">
        {#if entries.length === 0}
            <div class="text-center py-16">
                <div
                    class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-700 shadow-inner"
                >
                    <PenNib class="w-10 h-10 text-gray-400" />
                </div>
                <h2
                    class="text-xl font-bold mb-2 text-gray-900 dark:text-white"
                >
                    Start Your Journal
                </h2>
                <p
                    class="text-gray-500 dark:text-gray-400 mb-6 max-w-[250px] mx-auto"
                >
                    Write down your daily reflections, thoughts, and spiritual
                    insights.
                </p>
                <Button variant="primary" onclick={() => openEditor()}
                    >Write First Entry</Button
                >
            </div>
        {:else}
            <div class="space-y-4">
                {#each entries as entry (entry.id)}
                    <div in:fly={{ y: 20, duration: 300 }}>
                        <Card
                            variant="default"
                            class="p-5 relative group"
                            onclick={() => openEditor(entry)}
                        >
                            <div class="flex justify-between items-start mb-3">
                                <div
                                    class="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-2.5 py-1 rounded-full w-fit"
                                >
                                    <Calendar
                                        class="w-4 h-4 text-primary"
                                        weight="duotone"
                                    />
                                    {new Date(
                                        entry.timestamp,
                                    ).toLocaleDateString(undefined, {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                                {#if entry.saintId}
                                    {@const s = saints.find(
                                        (s) => s.id === entry.saintId,
                                    )}
                                    {#if s}
                                        <div
                                            class="text-[10px] font-bold uppercase tracking-wider text-temple-accent"
                                        >
                                            {s.name.en}
                                        </div>
                                    {/if}
                                {/if}
                            </div>

                            <h3
                                class="text-sm font-medium text-gray-600 dark:text-gray-300 italic mb-2"
                            >
                                "{entry.prompt}"
                            </h3>
                            <p
                                class="text-gray-800 dark:text-gray-100 leading-relaxed line-clamp-3"
                            >
                                {entry.text}
                            </p>
                        </Card>
                    </div>
                {/each}
            </div>
        {/if}
    </main>

    <!-- Editor Bottom Sheet -->
    <BottomSheet
        bind:open={isEditorOpen}
        title={currentEntryId ? "Edit Entry" : "New Reflection"}
    >
        <div class="space-y-4 max-h-[70vh] flex flex-col pt-2">
            <!-- Prompt -->
            <div class="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                <span
                    class="text-xs font-bold text-primary uppercase tracking-wider block mb-1"
                    >Today's Prompt</span
                >
                <p class="text-gray-800 dark:text-gray-200 font-medium italic">
                    "{selectedPrompt}"
                </p>
            </div>

            <!-- Link to Saint -->
            <div>
                <label
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >Link a Saint (Optional)</label
                >
                <select
                    bind:value={relatedSaintId}
                    class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none font-medium"
                >
                    <option value="">None</option>
                    {#each saints as s}
                        <option value={s.id}>{s.name.en}</option>
                    {/each}
                </select>
            </div>

            <!-- Editor -->
            <div class="flex-1 min-h-[200px] flex flex-col">
                <label
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >Your Thoughts</label
                >
                <textarea
                    bind:value={entryText}
                    class="w-full flex-1 min-h-[150px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                    placeholder="Write your reflections here..."
                ></textarea>
            </div>

            <div class="pt-4 flex gap-3 pb-safe-bottom">
                <Button
                    variant="ghost"
                    class="flex-1"
                    onclick={() => (isEditorOpen = false)}>Cancel</Button
                >
                <Button variant="primary" class="flex-2" onclick={saveEntry}
                    >{currentEntryId ? "Update" : "Save"} Entry</Button
                >
            </div>
        </div>
    </BottomSheet>
</div>
