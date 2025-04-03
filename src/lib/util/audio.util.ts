type AudioState = 'play' | 'pause'
export class AudioWrapper {
    audio: HTMLAudioElement;
    state: AudioState = 'pause';
    listeners: ((state: AudioState, oldState: AudioState) => any)[] = [];

    constructor(audioSource: str) {
        this.audio = new Audio(audioSource);
    }

    setAudio = (audioSource: str) =>
        this.audio = new Audio(audioSource)

    play = () => new Promise(res => {
        this.audio.play();
        this._setState('play');

        const onEnded = () => {
            this._setState('pause');
            this.audio.removeEventListener('ended', onEnded);
            res(true);
        };

        this.audio.addEventListener('ended', onEnded);
    });

    pause = () => new Promise(res => {
        this.audio.pause();
        this._setState('pause');
        res(true);
    });

    on = (callback: () => any) => {
        this.listeners.push(callback);
    }

    private _setState = (newState: AudioState) => {
        if (this.state === newState) return;

        const oldState = this.state;
        this.state = newState;

        // Notify all listeners about the state change
        this.listeners.forEach(callback => callback(newState, oldState));
    }
}