<script lang="ts">
    import { TIMER_STATE_TITLES } from "$lib/consts";
    import { _time, timer } from "$lib/store/data.store";
    import { updItem } from "$lib/store/store";
    import { debounceById } from "$lib/util/utils.util";
</script>

<h2 class="text-center" style="margin:  0;">
    {TIMER_STATE_TITLES[$timer.state]}
</h2>

<div id="clock" class="bg-deep-purple text-center pb-3 max-w-96 sm:max-w-screen mx-auto">
    <div class="mx-auto relative">
      <div id="timer" class="filter drop-shadow text-7xl font-overpass-mono absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{$_time.timeRemaining}</div>
      <div class="w-full xs:w-3/4 sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/3 mx-auto">
        <svg viewBox="0 0 39 39" id="timerRing" fill="none" class="">
          <defs>
            <linearGradient id="timer-ring-gradient">
                <stop offset="0%" stop-color="#FFB56B" />
                <stop offset="30%" stop-color="#BC365D" />
                <stop offset="100%" stop-color="#1F005C" />
            </linearGradient>
          </defs>
          <circle id="shadow-circle" class="filter drop-shadow" stroke="#2D2D2D" stroke-width="3px" cx="50%" cy="50%" r="15.9155"/>
          <circle id="timer-circle" class="-rotate-90 origin-center" stroke="url(#timer-ring-gradient)" stroke-dasharray="{$_time.prc}, 100" stroke-width="3px" stroke-linecap="round" cx="50%" cy="50%" r="15.9155"/>
        </svg>
      </div>
    </div>
</div>

<div class="flex flex-col sm:flex-row max-w-xl mx-auto">
    <div id="options" class="container mx-auto">
        <div id="timerOptions" class="flex justify-center items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-4 size-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <label>
                Focus: {$timer.focus / 1000 / 60} Min
                <input
                    type="range"
                    step="5"
                    min="5"
                    max="90"
                    class="min-w-32"
                    value={$timer.focus / 1000 / 60}
                    oninput={(e) => {
                        const focus = $timer.focus = Number((e.target as any).value) * 1000 * 60;
                        debounceById(() => updItem({ ...$timer, focus }), 250, '$timer.focus');
                    }}
                />
            </label>
        </div>
    </div>

    <div id="options" class="container mx-auto">
        <div id="timerOptions" class="flex justify-center items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-4 size-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
            <label>
                Rest: {$timer.rest / 1000 / 60} Min
                <input
                    type="range"
                    step="1"
                    min="1"
                    max="20"
                    class="min-w-32"
                    value={$timer.rest / 1000 / 60}
                    oninput={(e) => {
                        const rest = $timer.rest = Number((e.target as any).value) * 1000 * 60
                        debounceById(() => updItem({ ...$timer, rest }), 250, '$timer.rest');
                    }}
                />
            </label>
        </div>
    </div>
</div>