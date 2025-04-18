<script lang="ts" generics="ID extends (str | num)">
    import { isType } from '$lib/util/utils.util';
    import Button from './Button.comp.svelte';

    type BtnType = 'outline' | 'cta' | 'plain';
    type Name = str | { class: str; name: str; }[];
    type TabItem<ID> =
        | [Name, ID]
        | [Name, ID, (id: ID) => any]
        | readonly [Name, ID]
        | readonly [Name, ID, (id: ID) => any];

    let {
        class: className = '',
        style,
        btnClass = '',
        selClass = 'outline',
        selBtn,
        unSelClass = 'secondary outline',
        unSelBtn = 'plain',
        tabs,
        btnSize,
        selId = $bindable(),
        onTabClick,
    }: {
        class?: str;
        style?: string | undefined | null;
        btnSize?: Size | 'auto';

        /** Css classes that are used by both selected and unselected buttons */
        btnClass?: str;

        selClass?: str;
        selBtn?: BtnType;

        unSelClass?: str;
        unSelBtn?: BtnType;

        /** `[name, id, fct]` */
        tabs: TabItem<ID>[] | readonly TabItem<ID>[];
        selId: ID;

        onTabClick?: (tab: TabItem<ID>) => any
    } = $props();
</script>

<div class={className} {style} role="group">
    {#each tabs as tab (tab[0])}
        {@const [name, id, fct] = tab}
        <Button
            onclick={fct ? () => {
                fct(id);
                onTabClick?.(tab);
            } : () => {
                selId = id;
                onTabClick?.(tab);
            }}
            class={[btnClass, id === selId ? selClass : unSelClass]}
            btnType={id === selId ? selBtn : unSelBtn}
            size={btnSize}
        >{@render renderName(name)}</Button>
    {/each}
</div>

{#snippet renderName(name: Name)}
    {#if isType(name, 'string')}
      {name}
    {:else}
      {#each name as item}
          <span class={item.class}>{item.name}</span>
      {/each}
    {/if}
{/snippet}