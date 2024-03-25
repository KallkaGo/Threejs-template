import { create } from "zustand";
import RES from "@/three/RES";

/**
 * 用户交互状态
 */
const useInteractStore = create(() => ({
    touch: false,
    auto: false,
    demand: false,
    isMute: false,
    audioAllowed: false,
    browserHidden: false,
    begin: false,
    dom: document.createElement("div"),  //用于在ui界面接收mesh的点击事件
    end: false,
}));

const useGameStore = create(() => ({
    time: 0,
    transfer: false,
}));

const useLoadedStore = create(() => ({
    loaded: false,
}));

/**
 * 加载进度
 */
// const useLoadStore = create(() => ({ isLoaded: false }));

export { useInteractStore, useGameStore, useLoadedStore };
