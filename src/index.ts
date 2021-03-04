import { mergeConfig, getCurrentState, titleFormatter, formatTime } from './helper'

export interface LogConfig {
    enable?: boolean
    duration?: boolean
    timestamp?: boolean
}

export interface BufferModel {
    name: string
    action: string
    started: number
    startedTime: object
    payload: any[]
    prevState: any
    took: number
    nextState: any
}

export default (config: LogConfig) => {
    const logOptions = mergeConfig(config);

    if (!logOptions.enable) return {};

    const logBuffer: BufferModel[] = [];

    const printLog = (buffer: BufferModel[]) => {
        buffer.forEach((log, index) => {
            const { started, startedTime, name, action, payload, prevState } = log;
            let { took, nextState } = log;
            const nextLog: BufferModel = buffer[index + 1];
            if (nextLog && nextLog.started && started) {
                nextState = nextLog.prevState;
                took = nextLog.started - started;
            }
            const headerCSS = ['color: gray; font-weight: lighter;', 'color: inherit; font-weight: bold;'];
            if (logOptions.timestamp) headerCSS.push('color: gray; font-weight: lighter;');
            if (logOptions.duration) headerCSS.push('color: gray; font-weight: lighter;');
            const title = titleFormatter(logOptions, name, formatTime(startedTime), took);
            try {
                console.group(`%c ${title}`, ...headerCSS);
                console.log('%c prev state', 'color: #03A9F4; font-weight: bold', prevState);
                console.log('%c reducer', 'color: #FFA07A; font-weight: bold', action,  ...payload );
                console.log('%c next state', 'color: #4CAF50; font-weight: bold', nextState);
                console.groupEnd();
            } catch (error) {
                // ignore print error
            }
        });
    };

    return {
        onModel({ name }: any, store: any): void {
            const modelActions = store.dispatch[name];
            Object.keys(modelActions).forEach((action) => {
                // filter effect actions
                if (store.dispatch[name][action].isEffect === true) return;

                // record origin effect
                const origEffect = store.dispatch[name][action];

                // build new wrapper
                const effectWrapper = (...args: any[]) => {
                    const logEle: BufferModel = {
                        name: name,
                        action: action,
                        started: Date.now(),
                        startedTime: new Date(),
                        payload: args,
                        prevState: getCurrentState(store, name),
                        took: 0,
                        nextState: null
                    };
                    logBuffer.push(logEle);
                    let effectResult;
                    try {
                        effectResult = origEffect(...args);
                    } catch (error) {
                        throw error;
                    }
                    logEle.took = Date.now() - logEle.started;
                    logEle.nextState = getCurrentState(store, name);
                    printLog(logBuffer);
                    logBuffer.length = 0;
                    return effectResult;
                };

                // replace existing effect with new wrapper
                store.dispatch[name][action] = effectWrapper;
            });
        }
    };
};