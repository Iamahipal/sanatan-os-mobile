<script lang="ts">
    import { toast } from "$lib/stores/toast";
    import {
        DownloadSimple,
        ShareNetwork,
        Quotes,
    } from "@phosphor-icons/svelte";
    import type { Saint } from "$lib/domain/types";

    let { quote, saint }: { quote: string; saint: Saint } = $props();

    async function generateImageAndShare(downloadDataOnly: boolean = false) {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
        gradient.addColorStop(0, "#FFF8E7"); // Temple lightest
        gradient.addColorStop(1, "#FFCC80"); // Temple primary
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1080);

        // Border Design
        ctx.strokeStyle = "#D97706";
        ctx.lineWidth = 12;
        ctx.strokeRect(40, 40, 1000, 1000);

        // Quote Text (Word Wrap)
        ctx.fillStyle = "#451A03";
        ctx.font = 'bold 64px "Outfit", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const words = quote.split(" ");
        let line = "";
        const lines = [];
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 800 && n > 0) {
                lines.push(line);
                line = words[n] + " ";
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        let startY = 540 - (lines.length - 1) * 40;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 540, startY + i * 80);
        }

        // Author Name
        ctx.font = '48px "Inter", sans-serif';
        ctx.fillStyle = "#92400E";
        ctx.fillText(
            `— ${saint.name.en}`,
            540,
            startY + lines.length * 80 + 60,
        );

        // Branding
        ctx.font = '32px "Inter", sans-serif';
        ctx.fillStyle = "#B45309";
        ctx.fillText("Bharat Sant Darshan", 540, 980);

        canvas.toBlob(
            async (blob) => {
                if (!blob) return;

                if (
                    !downloadDataOnly &&
                    navigator.canShare &&
                    navigator.canShare({
                        files: [
                            new File([blob], "darshan.png", {
                                type: "image/png",
                            }),
                        ],
                    })
                ) {
                    try {
                        const file = new File([blob], `quote-${saint.id}.png`, {
                            type: "image/png",
                        });
                        await navigator.share({
                            title: `${saint.name.en} Quote`,
                            files: [file],
                        });
                    } catch (e) {
                        console.error("Sharing failed", e);
                        triggerDownload(blob);
                    }
                } else {
                    triggerDownload(blob);
                }
            },
            "image/png",
            1.0,
        );
    }

    function triggerDownload(blob: Blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sant-darshan-${saint.id}-quote.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.add("Image saved to device!", "success");
    }
</script>

<div
    class="relative group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] p-6 shadow-sm overflow-hidden flex flex-col items-center text-center"
>
    <!-- Decorative -->
    <div class="absolute -top-6 -left-6 opacity-10 text-primary">
        <Quotes class="w-24 h-24" weight="fill" />
    </div>

    <p
        class="text-xl md:text-2xl font-display font-medium text-gray-800 dark:text-gray-100 italic leading-relaxed z-10 my-4"
    >
        "{quote}"
    </p>

    <div class="mt-4 flex gap-3 z-10 w-full justify-center">
        <button
            onclick={() => generateImageAndShare(false)}
            class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm active:scale-95"
            aria-label="Share as Image"
        >
            <ShareNetwork class="w-4 h-4" weight="bold" /> Share
        </button>
        <button
            onclick={() => generateImageAndShare(true)}
            class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95"
            aria-label="Download Image"
        >
            <DownloadSimple class="w-4 h-4" weight="bold" /> Save
        </button>
    </div>
</div>
