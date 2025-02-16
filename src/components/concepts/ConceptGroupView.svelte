<script lang="ts">
    import { slide } from 'svelte/transition';
    import type Concept from '@concepts/Concept';
    import CodeView from './CodeView.svelte';
    import Note from '../widgets/Note.svelte';
    import { animationDuration } from '../../db/Database';

    export let concepts: Concept[];

    let expanded = false;

    function toggle() {
        expanded = !expanded;
    }
</script>

<div class="concept-group">
    {#each concepts as concept, index}
        {#if expanded || index < 3}
            <span
                transition:slide|local={{
                    duration: $animationDuration,
                }}
            >
                <CodeView {concept} node={concept.getRepresentation()} />
            </span>
        {/if}
    {:else}
        <Note>&mdash;</Note>
    {/each}
</div>
{#if expanded || concepts.length > 3}
    <div
        role="button"
        class="expander"
        class:expanded
        tabindex="0"
        on:pointerdown={toggle}
        on:keydown={(event) =>
            event.key === ' ' || event.key === 'Enter' ? toggle() : undefined}
        >{#if expanded}▲{:else}▼{/if}</div
    >
{/if}

<style>
    .concept-group {
        margin: var(--wordplay-spacing);
        margin-left: 0;
        display: flex;
        flex-wrap: wrap;
        gap: calc(2 * var(--wordplay-spacing));
        align-items: baseline;
        border-top: var(--wordplay-border-color) dotted
            var(--wordplay-border-width);
        border-bottom: var(--wordplay-border-color) dotted
            var(--wordplay-border-width);
        padding-top: var(--wordplay-spacing);
        padding-bottom: var(--wordplay-spacing);
    }

    .expander {
        text-align: center;
        cursor: pointer;
        color: var(--wordplay-inactive-color);
    }

    .expander {
        transition: transform ease-out;
        transition-duration: calc(var(--animation-factor) * 200ms);
    }

    .expander:focus {
        transform: scale(1.1);
        color: var(--wordplay-focus-color);
        outline: none;
    }

    .expander:hover {
        transform: scale(1.1);
        color: var(--wordplay-highlight-color);
    }
</style>
