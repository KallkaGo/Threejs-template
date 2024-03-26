import {
    Environment,
    OrbitControls,
    Sky,
    useEnvironment,
    useFBO,
} from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Mesh, Uniform, Vector2 } from "three";
import vertexShader from "../shaders/sketch/vertex.glsl";
import fragmentShader from "../shaders/sketch/fragment.glsl";
import { useFrame, useThree } from "@react-three/fiber";

import env from "/env/env.hdr";

const Sketch = () => {
    const envTex = useEnvironment({ files: env });
    const cylin1Ref = useRef<Mesh>(null);

    const cylin2Ref = useRef<Mesh>(null);

    const boxRef = useRef<Mesh>(null);

    const torusKnoRef = useRef<Mesh>(null);

    const boxFBO = useFBO({ samples: 8 });

    const torusKnoFBO = useFBO({ samples: 8 });

    const cylinUniform1 = useMemo(
        () => ({
            uTexture: new Uniform(boxFBO.texture),
            uResolution: new Uniform(
                new Vector2(
                    innerWidth * devicePixelRatio,
                    innerWidth * devicePixelRatio
                )
            ),
        }),
        []
    );

    const cylinUniform2 = useMemo(
        () => ({
            uTexture: new Uniform(torusKnoFBO.texture),
            uResolution: new Uniform(
                new Vector2(
                    innerWidth * devicePixelRatio,
                    innerWidth * devicePixelRatio
                )
            ),
        }),
        []
    );

    useFrame((state, delta) => {
        const { clock, gl, scene, camera, viewport } = state;
        const box = boxRef.current!;
        const torusKno = torusKnoRef.current!;
        const cylin1 = cylin1Ref.current!;
        const cylin2 = cylin2Ref.current!;

        box.position.z = Math.sin(clock.getElapsedTime()) * 2;
        torusKno.position.z = Math.sin(clock.getElapsedTime()) * 2;
        box.rotation.x = Math.cos(clock.elapsedTime / 2);
        box.rotation.y = Math.sin(clock.elapsedTime / 2);
        box.rotation.z = Math.sin(clock.elapsedTime / 2);

        torusKno.rotation.x = Math.cos(clock.elapsedTime / 2);
        torusKno.rotation.y = Math.sin(clock.elapsedTime / 2);
        torusKno.rotation.z = Math.sin(clock.elapsedTime / 2);

        cylinUniform1.uResolution.value.set(
            innerWidth * viewport.dpr,
            innerHeight * viewport.dpr
        );
        cylinUniform2.uResolution.value.set(
            innerWidth * viewport.dpr,
            innerHeight * viewport.dpr
        );

        /* Box */
        torusKno.visible = false;
        cylin1.visible = false;
        box.visible = true;

        gl.setRenderTarget(boxFBO);
        gl.render(scene, camera);
        /* torusKno*/

        box.visible = false;
        cylin2.visible = false;
        torusKno.visible = true;

        gl.setRenderTarget(torusKnoFBO);
        gl.render(scene, camera);

        cylin1.visible = true;
        cylin2.visible = true;
        gl.setRenderTarget(null);
    });

    return (
        <>
            <OrbitControls  enableZoom={false} autoRotate  autoRotateSpeed={3} />
            <Sky sunPosition={[10, 10, 0]} />
            <Environment map={envTex} />
            <directionalLight position={[10, 10, 0]} intensity={1} />
            <ambientLight intensity={0.5} />
            <mesh
                ref={cylin1Ref}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, -4]}
            >
                <cylinderGeometry args={[3, 3, 8, 32]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={cylinUniform1}
                    attach="material-0"
                />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={cylinUniform1}
                    attach="material-1"
                />
                <meshStandardMaterial
                    attach="material-2"
                    color="green"
                    transparent
                    opacity={0}
                />
            </mesh>
            <mesh
                ref={cylin2Ref}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 4]}
            >
                <cylinderGeometry args={[3, 3, 8, 32]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={cylinUniform2}
                    attach="material-0"
                />
                <meshStandardMaterial
                    attach="material-1"
                    color="green"
                    transparent
                    opacity={0}
                />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={cylinUniform2}
                    attach="material-2"
                />
            </mesh>

            <mesh>
                <torusGeometry args={[3, 0.2, 16, 100]} />
                <meshStandardMaterial color="#F9F9F9" />
            </mesh>

            <mesh ref={torusKnoRef} position={[0, 0, 0]}>
                <torusKnotGeometry args={[0.75, 0.3, 100, 16]} />
                <meshPhysicalMaterial
                    roughness={0}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    color="#73B9ED"
                />
            </mesh>
            <mesh ref={boxRef} position={[0, 0, 0]}>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshPhysicalMaterial
                    roughness={0}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    color="#73B9ED"
                />
            </mesh>
        </>
    );
};

export default Sketch;
