<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";
    import { onMount, type Snippet } from "svelte";
    import { cssMerge } from "$lib/util/utils.util";


    type BtnTypes = 'outline' | 'cta' | 'plain';

    // let isHover = $state(false)
    // let isClick = $state(false)

    const sizeMap: obj<str, Size | 'auto'> = { xs: 'text-xs p-0.5 px-1', sm: 'text-sm p-1 px-2', md: 'text-base p-1.5 px-3', lg: 'text-lg p-2 px-4', xl: 'text-xl p-2.5 px-5', auto: 'px-2 py-4 h-full w-full'};
    const typeMap: obj<str, BtnTypes> = {
        outline: 'bg-transparent border-solid border-blue-400',
        cta: 'bg-blue-500 text-white border-blue-500',
        plain: 'border-transparent'
    };
    const typeActMap: obj<str ,BtnTypes> = {
        outline: 'hover:bg-slate-100 active:bg-slate-200',
        cta: 'hover:bg-blue-600 hover:border-blue-600 active:bg-blue-700 active:border-blue-700',
        plain: ''
    }

    const {
        children,
        class: className,
        size = 'md',
        btnType: type = 'cta',
        type: htmlType,
        disabled,
        // tabindex,
        // onclick,
        ...rest
    }: Omit<HTMLButtonAttributes, 'class' | 'tabindex'> & {
        children?: Snippet;
        // onclick?: MouseEventHandler<HTMLButtonElement> | undefined | null;
        // onmousedown?: MouseEventHandler<HTMLButtonElement> | undefined | null;
        class?: CssMergeArgs;
        // style?: str;
        size?: Size | 'auto';
        btnType?: BtnTypes;
        // disabled?: bol;
        // type?: 'reset' | 'submit' | 'button';
        tabindex?: -1 | 0;
        // title?: str;
        // 'aria-label'?: str;
    } = $props();

    let init = $state(false);
    onMount(() => init = true);
</script>

<!--
    onmousedown={() => isClick = disabled ? false : true}
    onmouseup={() => isClick = false}

    onmouseenter={() => isHover = disabled ? false : true}
    onmouseleave={() => isHover = false}
-->

<button
    {...rest}
    disabled={!init || disabled}
    class={cssMerge(
        "relative border-2 rounded hover:cursor-pointer", sizeMap[size], typeMap[type],
        !disabled && typeActMap[type],
        className
    )}
    type={htmlType}
>{#if children}{@render children()}{/if}</button>

<style>
    button:disabled {
        pointer-events: none;
        filter: grayscale(25%) brightness(95%);
    }

    button:disabled:hover,
    button:disabled:active {
        pointer-events: none;
        background-color: initial;
        box-shadow: none;
    }
</style>