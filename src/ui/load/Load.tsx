import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { LoadWrapper } from "./style";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IProps } from "../types";
import { useProgress } from "@react-three/drei";
import Sys from "@utils/Sys";
import { useInteractStore, useLoadedStore } from "@utils/Store";
import EnterButton from "./EnterButton";

/**
 * 加载总数
 */
// const TOTAL = 11;
const TOTAL = 3;

const Load: FC<IProps> = memo(({ emit }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const { loaded, item, total } = useProgress();
    const { contextSafe } = useGSAP();

    const [device, setDevice] = useState<"pc" | "mobile">(Sys.getSystem);

    useEffect(() => {
        console.log("ooo");

        const onResize = () => {
            const sys = Sys.getSystem() === "pc" ? "pc" : "mobile";
            setDevice(sys);
        };
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    const close = contextSafe(() => {
        gsap.to(panelRef.current, {
            opacity: 0,
            duration: 0.35,
            delay: 0.5,
            ease: "none",
            onComplete: () => {
                useInteractStore.setState({ audioAllowed: true });
                emit("hide-load");
            },
        });
        emit("show-game");
        useInteractStore.setState({ begin: true });
    });
    return (
        <LoadWrapper className={`abs panel ${device}`} ref={panelRef}>
            <div className="abs bg" />
            <div className="abs land" />
            <div className="abs add" />
            <div className="abs title" />
            <div className="abs footer" />
            <EnterButton
                progress={loaded / TOTAL}
                onPointerDown={e => {
                    close();
                }}
            />
            <div className="abs fg" />
            {/* <div className="abs bottom" /> */}
        </LoadWrapper>
    );
});

export default Load;
