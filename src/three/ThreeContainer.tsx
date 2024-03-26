import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useInteractStore } from "@utils/Store";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Sketch from "./components/Sketch";
export default function ThreeContainer() {
    const demand = useInteractStore((state) => state.demand);
    return (
        <>
            <Canvas
                frameloop={demand ? "never" : "always"}
                className="webgl"
                dpr={[1, 1]}
                camera={{
                    fov: 50,
                    near: 0.1,
                    position: [0, 0, 20],
                    far: 2000,
                }}
            >
                {location.hash.includes("debug") ? (
                    <Perf position="top-left" />
                ) : (
                    <Leva hidden />
                )}
                <Suspense fallback={null}>
                    <Sketch />
                </Suspense>
            </Canvas>
        </>
    );
}
