<script lang="ts">
    import { cn } from '$lib/utils';
    import type { Snippet } from 'svelte';

    type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'temple';
    type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

    let {
        variant = 'primary',
        size = 'md',
        class: className = '',
        disabled = false,
        onclick,
        children,
        type = 'button'
    }: {
        variant?: ButtonVariant;
        size?: ButtonSize;
        class?: string;
        disabled?: boolean;
        onclick?: (event: MouseEvent) => void;
        children: Snippet;
        type?: 'button' | 'submit' | 'reset';
    } = $props();

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
        secondary: 'bg-secondary text-primary hover:bg-secondary/80',
        outline: 'border border-primary/20 text-primary hover:bg-primary/5',
        ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
        temple: 'bg-temple text-primary hover:bg-temple/90 shadow-sm border border-temple-accent/20'
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10 flex items-center justify-center p-0'
    };
</script>

<button
    {type}
    class={cn(
        'inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200',
        variants[variant],
        sizes[size],
        className
    )}
    {disabled}
    onclick={onclick}
>
    {@render children()}
</button>
