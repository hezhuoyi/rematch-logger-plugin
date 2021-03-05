import { LogConfig } from './index'

const defaultConfig = {
    enable: true,
    duration: true,
    timestamp: true,
    effects: false
};

export const mergeConfig = (options: LogConfig) => {
    return Object.assign({}, defaultConfig, options);
};

export const getCurrentState = (rematchStore: any, modelName: string) => {
    return rematchStore.getState()[modelName];
};

export function titleFormatter(options: LogConfig, modelName: string, time: string , took: number, isEffect: boolean) {
    const parts = [isEffect ? 'effect' : 'state', `%c ${modelName}`];
    if (options.timestamp) parts.push(`%c @ ${time}`);
    if (options.duration && !isEffect) parts.push(`%c (in ${took} ms)`);
    return parts.join(' ');
}

const repeat = (str: string, times: number) => (new Array(times + 1)).join(str);
const pad = (num: number, maxLength: number) => repeat('0', maxLength - num.toString().length) + num;
export const formatTime = (time: any) => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;