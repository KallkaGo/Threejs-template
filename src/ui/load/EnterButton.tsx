import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
    FC,
    PointerEventHandler,
    memo,
    useEffect,
    useRef,
    useState,
} from "react";
import { EnterButtonWrapper } from "./style";

const EnterButton: FC<{
    progress: number;
    onPointerDown: PointerEventHandler;
}> = ({ progress, onPointerDown }) => {
    const strokeRef = useRef<SVGPathElement>(null);
    const text1Ref = useRef<SVGPathElement>(null);
    const text2Ref = useRef<SVGPathElement>(null);
    const { contextSafe } = useGSAP();
    const [isCmpl, setCmpl] = useState(false);

    useEffect(() => {
        const [stroke, text1, text2] = [
            strokeRef.current!,
            text1Ref.current!,
            text2Ref.current!,
        ];
        const setStyle = (path: SVGPathElement) => {
            path.style.strokeDasharray = `${path.getTotalLength()}px`;
            if (isCmpl) {
                path.style.strokeDashoffset = `0px`;
            } else {
                path.style.strokeDashoffset = `${path.getTotalLength()}px`;
            }
        };
        setStyle(stroke);
        setStyle(text1);
        setStyle(text2);

        if (isCmpl) {
            text1.style.fill = text1.style.stroke;
            text2.style.fill = text2.style.stroke;
        }
    }, [isCmpl]);

    const setTween = contextSafe((path: SVGPathElement) => {
        gsap.killTweensOf(path);
        gsap.to(path, {
            duration: 1,
            ease: "power1.out",
            strokeDashoffset: path.getTotalLength() * (1 - progress),
            onComplete: () => {
                if (progress >= 1) {
                    setCmpl(true);
                }
            },
        });
    });

    useEffect(() => {
        const [stroke, text1, text2] = [
            strokeRef.current!,
            text1Ref.current!,
            text2Ref.current!,
        ];

        setTween(stroke);
        setTween(text1);
        setTween(text2);
    }, [progress]);

    return (
        <EnterButtonWrapper
            className={`abs ${isCmpl ? "can-enter" : ""}`}
            onPointerDown={e => {
                if (isCmpl) {
                    onPointerDown(e);
                }
            }}
        >
            <svg className="svg" viewBox="0 0 122 52">
                <path
                    className="outer"
                    d="M26,1h70c13.8,0,25,11.2,25,25s-11.2,25-25,25H26C12.2,51,1,39.8,1,26S12.2,1,26,1z"
                />
                <path
                    ref={strokeRef}
                    className="outer-stroke"
                    d="M26,1h70c13.8,0,25,11.2,25,25s-11.2,25-25,25H26C12.2,51,1,39.8,1,26S12.2,1,26,1z"
                />
                <path
                    ref={text1Ref}
                    className="text"
                    d="M33.4,40c6.3-3.1,10.8-8.2,13-13.3c1.5,5.5,3.9,10.4,7.8,13.4c0.5-1.7,1.7-3.1,3.8-3.4l0.1-0.4c-6.4-3.1-10.1-9.6-11.8-17c-0.4-1.4-2.7-3.1-4.8-4.2c-0.4,0.6-1.3,2.3-1.6,2.9c1.8,0.4,4.4,0.8,4.9,1.5c-1.7,8.3-6.1,16-11.8,20.2L33.4,40z"
                    style={{ stroke: "#924133", fill: "#bb8f87" }}
                />
                <path
                    ref={text2Ref}
                    className="text"
                    d="M86.3,17.1H66.6l0.2,0.9h23.8c0.4,0,0.7-0.2,0.7-0.5c-1.3-1.1-3.3-2.6-3.3-2.6L86.3,17.1z M82.5,34.1c0.9,0,2.3-0.5,2.3-0.8v-12c0.5-0.1,0.8-0.3,1-0.5l-2.7-1.9l-1.3,1.1h-5.8l-2.9-1v15.4h0.4c1.2,0,2.3-0.6,2.3-0.9v-0.7H82v1.1H82.5zM82,20.9v5.1h-2.2v-5.1H82z M78,20.9v5.1h-2.2v-5.1H78z M75.8,26.9H78v5.1h-2.2V26.9z M79.8,32.1v-5.1H82v5.1H79.8z M87,36.1H70.8V23c0.7-0.1,0.9-0.4,1-0.8L68,21.8v14c-0.4,0.2-0.8,0.5-1,0.9l3,1.7l0.9-1.4H87v1.9h0.5c1,0,2.2-0.6,2.2-0.9V22c0.7-0.1,0.8-0.4,0.9-0.8L87,20.8V36.1z"
                    style={{ stroke: "#924133", fill: "#bb8f87" }}
                />
            </svg>
        </EnterButtonWrapper>
    );
};

export default memo(EnterButton);
