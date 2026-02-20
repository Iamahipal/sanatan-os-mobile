<script lang="ts">
    import { fade, fly, scale } from "svelte/transition";
    import { generateQuizQuestions } from "$lib/data/phase2-data";
    import {
        Trophy,
        CheckCircle,
        XCircle,
        ArrowRight,
        BookOpen,
    } from "phosphor-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";

    // Quiz State
    let isPlaying = $state(false);
    let isFinished = $state(false);
    let questions = $state<any[]>([]);
    let currentIndex = $state(0);
    let score = $state(0);

    // Answer State
    let selectedAnswer = $state<string | null>(null);
    let isCorrect = $state<boolean | null>(null);
    let showExplanation = $state(false);

    function startQuiz() {
        questions = generateQuizQuestions(5);
        currentIndex = 0;
        score = 0;
        isFinished = false;
        resetAnswerState();
        isPlaying = true;
    }

    function resetAnswerState() {
        selectedAnswer = null;
        isCorrect = null;
        showExplanation = false;
    }

    function handleAnswer(answerId: string) {
        if (selectedAnswer !== null) return; // Prevent double-clicking

        selectedAnswer = answerId;
        const currentQ = questions[currentIndex];
        isCorrect = answerId === currentQ.correctId;

        if (isCorrect) score++;
        showExplanation = true;
    }

    function nextQuestion() {
        if (currentIndex < questions.length - 1) {
            currentIndex++;
            resetAnswerState();
        } else {
            isFinished = true;
            isPlaying = false;
            // Here we would sync stats to Dexie if we fully implemented quizStats in userStore
        }
    }
</script>

<div class="min-h-full bg-surface pb-24" in:fade={{ duration: 300 }}>
    <!-- Header -->
    <header
        class="pt-safe-top px-4 py-4 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-30 bg-surface/90 backdrop-blur-md"
    >
        <div class="mt-2 text-center">
            <h1
                class="text-xl font-display font-bold text-gray-900 dark:text-white inline-flex items-center gap-2 justify-center"
            >
                <Trophy class="w-6 h-6 text-yellow-500" weight="duotone" /> Spiritual
                Quizzes
            </h1>
        </div>
    </header>

    <main class="px-5 py-8">
        {#if !isPlaying && !isFinished}
            <div class="text-center py-10" in:fly={{ y: 20, duration: 400 }}>
                <div
                    class="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Trophy class="w-12 h-12 text-yellow-500" weight="fill" />
                </div>
                <h2
                    class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3"
                >
                    Test Your Knowledge
                </h2>
                <p
                    class="text-gray-600 dark:text-gray-300 mb-8 max-w-xs mx-auto"
                >
                    Take a quick 5-question quiz to deepen your understanding of
                    the saints and their teachings.
                </p>
                <Button
                    variant="primary"
                    size="lg"
                    onclick={startQuiz}
                    class="w-full max-w-[250px]">Start Quiz</Button
                >
            </div>
        {:else if isPlaying && !isFinished}
            {@const currentQ = questions[currentIndex]}
            <div in:fade={{ duration: 300 }} class="max-w-md mx-auto">
                <div class="flex justify-between items-center mb-6">
                    <span class="text-sm font-bold text-gray-500"
                        >Question {currentIndex + 1} of {questions.length}</span
                    >
                    <div class="flex gap-1">
                        {#each questions as _, i}
                            <div
                                class="w-6 h-1.5 rounded-full transition-colors {i <
                                currentIndex
                                    ? 'bg-green-500'
                                    : i === currentIndex
                                      ? 'bg-primary'
                                      : 'bg-gray-200 dark:bg-gray-700'}"
                            ></div>
                        {/each}
                    </div>
                </div>

                <Card class="p-6 mb-6 shadow-md border-primary/10">
                    <!-- Svelte requires the text to be rendered explicitly -->
                    <h2
                        class="text-xl font-medium text-gray-900 dark:text-white leading-relaxed mb-6 font-display"
                    >
                        {currentQ.question}
                    </h2>

                    <div class="space-y-3">
                        {#each currentQ.options as option}
                            {@const isSelected = selectedAnswer === option.id}
                            {@const isCorrectAns =
                                option.id === currentQ.correctId}
                            {@const statusClass = !selectedAnswer
                                ? "hover:border-primary/50 hover:bg-primary/5"
                                : isCorrectAns
                                  ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : isSelected
                                    ? "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : "opacity-50"}

                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div
                                class="w-full flex justify-between items-center p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 transition-all font-medium {statusClass} {selectedAnswer ===
                                null
                                    ? 'cursor-pointer active:scale-[0.98]'
                                    : 'cursor-default'}"
                                onclick={() => handleAnswer(option.id)}
                            >
                                <span>{option.text}</span>
                                {#if selectedAnswer !== null}
                                    {#if isCorrectAns}
                                        <CheckCircle
                                            class="w-5 h-5 text-green-500"
                                            weight="fill"
                                        />
                                    {:else if isSelected}
                                        <XCircle
                                            class="w-5 h-5 text-red-500"
                                            weight="fill"
                                        />
                                    {/if}
                                {/if}
                            </div>
                        {/each}
                    </div>
                </Card>

                {#if showExplanation}
                    <div
                        in:fly={{ y: 20, duration: 300 }}
                        class="flex flex-col items-center"
                    >
                        <Button
                            variant="primary"
                            onclick={nextQuestion}
                            class="w-full flex justify-center items-center gap-2"
                        >
                            {currentIndex < questions.length - 1
                                ? "Next Question"
                                : "View Results"}
                            <ArrowRight class="w-4 h-4" weight="bold" />
                        </Button>
                    </div>
                {/if}
            </div>
        {:else if isFinished}
            <div
                class="text-center py-10"
                in:scale={{ duration: 400, start: 0.95 }}
            >
                <div
                    class="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 {score ===
                    questions.length
                        ? 'bg-green-100'
                        : score > 2
                          ? 'bg-yellow-100'
                          : 'bg-gray-100'}"
                >
                    {#if score === questions.length}
                        <Trophy
                            class="w-16 h-16 text-green-500"
                            weight="fill"
                        />
                    {:else if score > 2}
                        <CheckCircle
                            class="w-16 h-16 text-yellow-500"
                            weight="fill"
                        />
                    {:else}
                        <BookOpen
                            class="w-16 h-16 text-gray-500"
                            weight="duotone"
                        />
                    {/if}
                </div>

                <h2
                    class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2"
                >
                    {score} / {questions.length}
                </h2>
                <p
                    class="text-lg font-medium mb-8 text-gray-600 dark:text-gray-300"
                >
                    {score === questions.length
                        ? "Perfect Score! True Scholar."
                        : score > 2
                          ? "Great effort! Keep seeking."
                          : "A good start. Read more darshans!"}
                </p>

                <div class="flex gap-4 justify-center">
                    <Button
                        variant="outline"
                        onclick={() => {
                            isFinished = false;
                            isPlaying = false;
                        }}>Back</Button
                    >
                    <Button variant="primary" onclick={startQuiz}
                        >Try Again</Button
                    >
                </div>
            </div>
        {/if}
    </main>
</div>
