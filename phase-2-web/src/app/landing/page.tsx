"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Menu, CheckSquare } from "lucide-react";
import Link from "next/link";

// --- SHADERS ---
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

/* noise helpers omitted for brevity – unchanged */

void main() {
  vec2 st = vUv;
  st.x *= uResolution.x / uResolution.y;

  vec2 mouse = uMouse;
  mouse.x *= uResolution.x / uResolution.y;
  float dist = distance(st, mouse);
  float mouseForce = smoothstep(0.4, 0.0, dist);

  vec3 color = vec3(0.05);
  color += vec3(0.3) * mouseForce * 0.5;

  float scanline = sin(vUv.y * 800.0) * 0.02;
  color -= scanline;

  gl_FragColor = vec4(color, 1.0);
}
`;

// --- FLUID PLANE ---
function FluidPlane() {
  const mesh =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null!);
  const { viewport } = useThree();

  const uniforms = useMemo<
    Record<string, THREE.IUniform>
  >(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uResolution: {
        value: new THREE.Vector2(viewport.width, viewport.height),
      },
    }),
    [viewport]
  );

  useFrame(({ clock, mouse }) => {
    const material = mesh.current.material;
    material.uniforms.uTime.value = clock.getElapsedTime();

    const targetX = (mouse.x + 1) / 2;
    const targetY = (mouse.y + 1) / 2;

    material.uniforms.uMouse.value.lerp(
      new THREE.Vector2(targetX, targetY),
      0.08
    );
  });

return (
  <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
    <planeGeometry args={[1, 1]} />
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
    />
  </mesh>
);

}

// --- GLITCH TEXT ---
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

type GlitchTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

function GlitchText({ text, className, delay = 0 }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState("");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let iteration = 0;

    const timeout = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((_, i) =>
              i < iteration
                ? text[i]
                : CHARS[Math.floor(Math.random() * CHARS.length)]
            )
            .join("")
        );

        if (iteration >= text.length && intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        iteration += 1 / 3;
      }, 30);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay]);

  return <span className={className}>{displayText}</span>;
}

// --- CURSOR ---
function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const spring = { damping: 20, stiffness: 300, mass: 0.5 };
  const x = useSpring(mouseX, spring);
  const y = useSpring(mouseY, spring);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - 10);
      mouseY.set(e.clientY - 10);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ x, y }}
      className="pointer-events-none fixed top-0 left-0 z-[100] h-5 w-5 rounded-full bg-white mix-blend-difference hidden md:block"
    />
  );
}

// --- FEATURE ITEM ---
type FeatureItemProps = {
  title: string;
  num: string;
};

function FeatureItem({ title, num }: FeatureItemProps) {
  return (
    <div className="group relative flex items-end justify-between border-b border-white/20 py-8 hover:border-white">
      <div>
        <span className="text-xs font-bold text-gray-500">{num}</span>
        <h2
          className="text-4xl font-bold uppercase tracking-tighter text-transparent group-hover:pl-4 group-hover:text-white transition-all"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
        >
          {title}
        </h2>
      </div>
      <span className="hidden md:block text-xs uppercase opacity-0 group-hover:opacity-100">
        Learn More
      </span>
    </div>
  );
}

// --- MAIN PAGE ---
export default function PremiumLandingPage() {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative h-screen w-full bg-[#050505] text-white selection:bg-white selection:text-black overflow-hidden font-sans">
      <Cursor />

      {/* PRELOADER */}
      {loading && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black text-white">
          <div className="font-mono text-xs uppercase tracking-widest">
            <GlitchText text="Loading TaskFlow..." delay={0} />
          </div>
        </div>
      )}

      {/* BACKGROUND SHADER */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <FluidPlane />
        </Canvas>
      </div>

      {/* UI OVERLAY */}
      <main className="relative z-10 h-full w-full flex flex-col justify-between p-8 md:p-12 mix-blend-exclusion pointer-events-none">
        {/* Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-2 bg-white animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">TaskFlow</span>
          </div>

          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="hidden md:block cursor-pointer hover:line-through">Features</span>
            <span className="hidden md:block cursor-pointer hover:line-through">Pricing</span>
            <span className="hidden md:block cursor-pointer hover:line-through">Contact</span>
            <div
              className="cursor-pointer hover:rotate-90 transition-transform"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </div>
          </div>
        </header>

        {/* Center Content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-6 pointer-events-auto">
          {!loading && (
            <>
              <div className="mb-2 text-center md:text-left">
                <GlitchText
                  text="Productivity Redefined."
                  className="text-xs font-bold uppercase tracking-[0.5em] text-gray-400"
                  delay={200}
                />
              </div>
              <h1 className="text-center md:text-left text-6xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-12">
                <span className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                    className="block"
                  >
                    Task
                  </motion.span>
                </span>
                <span
                  className="block overflow-hidden text-transparent"
                  style={{ WebkitTextStroke: "2px white" }}
                >
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                    className="block"
                  >
                    Management
                  </motion.span>
                </span>
              </h1>

              {/* Feature List */}
              <div className="mt-24 hidden md:block">
                <FeatureItem num="01" title="Smart Organization" />
                <FeatureItem num="02" title="Time Tracking" />
                <FeatureItem num="03" title="Team Collaboration" />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-end pointer-events-auto">
          <div className="flex gap-4">
            {["Twitter", "GitHub", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[10px] font-bold uppercase tracking-widest hover:line-through opacity-50 hover:opacity-100"
              >
                {social}
              </a>
            ))}
          </div>
          <Link href="/dashboard">
            <div className="h-12 w-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
              <CheckSquare size={16} />
            </div>
          </Link>
        </footer>
      </main>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center pointer-events-auto"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="text-center space-y-8">
            <motion.a
              href="#"
              className="block text-4xl font-bold uppercase tracking-tight hover:text-gray-400 transition-colors"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Features
            </motion.a>
            <motion.a
              href="#"
              className="block text-4xl font-bold uppercase tracking-tight hover:text-gray-400 transition-colors"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Pricing
            </motion.a>
            <motion.a
              href="#"
              className="block text-4xl font-bold uppercase tracking-tight hover:text-gray-400 transition-colors"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Contact
            </motion.a>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 border border-white hover:bg-white hover:text-black transition-colors text-sm font-bold uppercase tracking-widest"
              >
                Start Free
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
