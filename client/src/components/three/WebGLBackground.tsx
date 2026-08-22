import { useEffect, useRef, useState } from "react";

/**
 * Ambient particle-field background powered by Three.js.
 *
 * Safety model:
 *  - We test for real WebGL support before ever importing `three`.
 *  - The whole render path is wrapped in try/catch; any failure at any
 *    point (context creation, shader compile, driver quirk on an old
 *    device) just unmounts the canvas and leaves the CSS gradient
 *    fallback (already present on the parent section) untouched.
 *  - `three` is dynamically imported so it never blocks first paint and
 *    never breaks the page if the chunk fails to load (slow/offline
 *    network, ad-blocker, etc).
 *  - Fully cleaned up on unmount (geometry/material/renderer disposed,
 *    RAF cancelled, listeners removed) — no leaks when navigating.
 */

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");

    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

interface WebGLBackgroundProps {
  className?: string;
}

const WebGLBackground = ({ className }: WebGLBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!supportsWebGL()) {
      setFailed(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setFailed(true);
      return;
    }

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      try {
        const THREE = await import("three");

        if (cancelled || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
          60,
          width / height,
          0.1,
          100
        );
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Particle field
        const COUNT = 260;
        const positions = new Float32Array(COUNT * 3);

        for (let i = 0; i < COUNT; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 16;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );

        const material = new THREE.PointsMaterial({
          color: 0x6366f1,
          size: 0.045,
          transparent: true,
          opacity: 0.55,
          sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let rafId: number;
        let mouseX = 0;
        let mouseY = 0;

        const handlePointerMove = (event: PointerEvent) => {
          const rect = container.getBoundingClientRect();
          mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        };

        window.addEventListener("pointermove", handlePointerMove);

        const animate = () => {
          points.rotation.y += 0.0008;
          points.rotation.x += 0.0002;

          camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.02;
          camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.02;
          camera.lookAt(scene.position);

          renderer.render(scene, camera);
          rafId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
          if (!container) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        window.addEventListener("resize", handleResize);

        cleanup = () => {
          cancelAnimationFrame(rafId);
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("pointermove", handlePointerMove);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          if (renderer.domElement.parentElement === container) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch (error) {
        console.warn(
          "3D background disabled (falling back to static gradient):",
          error
        );
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  if (failed) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
    />
  );
};

export default WebGLBackground;
