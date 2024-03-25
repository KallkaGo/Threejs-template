import {
    FC,
    PointerEvent,
    PointerEventHandler,
    MouseEvent,
    memo,
    useEffect,
    useRef,
} from "react";
import gsap from "gsap";
import { GameWrapper } from "./style";
import { useGSAP } from "@gsap/react";
import { useGameStore, useInteractStore } from "../../utils/Store";
import { IProps } from "../types";
import { PageActionType } from "../Reducer";
import { usePreloadImages } from "@utils/usePreload";
// import RES from "../share/RES";

let isAni = false;
let control = false;

const Game: FC<IProps> = memo(({ emit }) => {
    const panelRef = useRef<Div>(null);
    const tapRef = useRef<Div>(null);
    const auRef = useRef<Div>(null);
    const time = useRef(0);

    /* 预加载资源 */
    // usePreloadImages(RES);

    const isMute = useInteractStore((state) => state.isMute);
    const end = useInteractStore((state) => state.end);
    const { contextSafe } = useGSAP();

    const showTip = contextSafe(() => {
        const tap = tapRef.current!;
        if (!tap) return;
        gsap.to(tap, { opacity: 1, duration: 0.3, delay: 3 });
    });

    const hideTip = contextSafe(() => {
        const tap = tapRef.current!;
        if (!tap) return;
        gsap.killTweensOf(tap);
        gsap.to(tap, { opacity: 0, duration: 0.3 });
    });

    useGSAP(() => {
        const [panel] = [panelRef.current!];
        gsap.set(panelRef.current, { opacity: 0 });
        gsap.to(panelRef.current, {
            opacity: 1,
            duration: 0.35,
            ease: "none",
            onComplete: () => {
                control = true;
            },
        });
    });
    useEffect(() => {
        useInteractStore.setState({ dom: panelRef.current! });
        console.log("panelRef.current", panelRef.current);
    }, []);

    const handlePointerDown = (e: PointerEvent) => {
        useInteractStore.setState({ touch: true });
        panelRef.current!.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        hideTip();
    };

    const handlePointerUp = (e: PointerEvent) => {
        panelRef.current!.removeEventListener("touchmove", handleTouchMove);
        showTip();
    };

    const handlePointerMove = (e: PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const handleClose = contextSafe((type: PageActionType) => {
        if (isAni) return;
        if (!control) return;
        isAni = true;
        control = false;
        // 通知外面 show game
        emit(type);
        gsap.to(panelRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: "none",
            onComplete: () => {
                emit("hide-game");
                isAni = false;
            },
        });
    });

    useEffect(() => {
        const onTouchMove = (e: any) => {
            e.stopPropagation();
            e.preventDefault();
        };
        panelRef.current?.addEventListener("touchmove", onTouchMove, {
            passive: false,
        });

        return () => {
            panelRef.current?.removeEventListener("touchmove", onTouchMove);
        };
    }, []);

    useEffect(() => {
        
    }, [end]);
    return (
        <GameWrapper
            ref={panelRef}
            className="abs game full"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onContextMenu={(e) => {
                // 防止长按出现菜单
                e.preventDefault();
            }}
        >
        </GameWrapper>
    );
});

export default Game;
