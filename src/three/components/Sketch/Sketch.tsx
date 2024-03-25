import { OrbitControls } from "@react-three/drei";

const Sketch = () => {
    return (
        <>
            <OrbitControls />
            <color attach={'background'}  args={['black']} />
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="hotpink" />
            </mesh>
        </>
    );
};

export default Sketch;
