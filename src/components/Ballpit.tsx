import { useRef, useEffect } from 'react';
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  ShaderChunk,
  Color,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface BallpitProps {
  className?: string;
  followCursor?: boolean;
  count?: number;
  colors?: number[];
  materialParams?: {
    metalness?: number;
    roughness?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
  };
}

class ThreeRenderer {
  private config: any;
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene: Scene;
  renderer: WebGLRenderer;
  private postprocessing?: any;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.renderScene;
  onBeforeRender = () => { };
  onAfterRender = () => { };
  onAfterResize = () => { };
  private isVisible = false;
  private isAnimating = false;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private resizeTimeout?: NodeJS.Timeout;
  private clock = new Clock();
  private time = { elapsed: 0, delta: 0 };
  private animationId?: number;

  constructor(config: any) {
    this.config = { ...config };
    this.initCamera();
    this.initScene();
    this.initRenderer();
    this.resize();
    this.initEventListeners();
  }

  private initCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  private initScene() {
    this.scene = new Scene();
  }

  private initRenderer() {
    if (this.config.canvas) {
      this.canvas = this.config.canvas;
    } else if (this.config.id) {
      this.canvas = document.getElementById(this.config.id) as HTMLCanvasElement;
    } else {
      console.error("Three: Missing canvas or id parameter");
      return;
    }
    
    this.canvas.style.display = "block";
    const rendererConfig = {
      canvas: this.canvas,
      powerPreference: "high-performance",
      ...(this.config.rendererOptions ?? {}),
    };
    this.renderer = new WebGLRenderer(rendererConfig);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  private initEventListeners() {
    if (!(this.config.size instanceof Object)) {
      window.addEventListener("resize", this.handleResize.bind(this));
      if (this.config.size === "parent" && this.canvas.parentNode) {
        this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
        this.resizeObserver.observe(this.canvas.parentNode);
      }
    }
    
    this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
    this.intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
  }

  private cleanupEventListeners() {
    window.removeEventListener("resize", this.handleResize.bind(this));
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    this.isVisible = entries[0].isIntersecting;
    this.isVisible ? this.startAnimation() : this.stopAnimation();
  }

  private handleVisibilityChange() {
    if (this.isVisible) {
      document.hidden ? this.stopAnimation() : this.startAnimation();
    }
  }

  private handleResize() {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let width, height;
    if (this.config.size instanceof Object) {
      width = this.config.size.width;
      height = this.config.size.height;
    } else if (this.config.size === "parent" && this.canvas.parentNode) {
      width = this.canvas.parentNode.offsetWidth;
      height = this.canvas.parentNode.offsetHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    
    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;
    this.updateCamera();
    this.updateRenderer();
    this.onAfterResize(this.size);
  }

  private updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.adjustFOV(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.adjustFOV(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  private adjustFOV(targetAspect: number) {
    const tan = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / targetAspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(tan));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const fov = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(fov / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = this.camera.top - this.camera.bottom;
      this.size.wWidth = this.camera.right - this.camera.left;
    }
  }

  private updateRenderer() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.postprocessing?.setSize(this.size.width, this.size.height);
    
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  get postprocessing() {
    return this.postprocessing;
  }

  set postprocessing(value: any) {
    this.postprocessing = value;
    this.render = value.render.bind(value);
  }

  private startAnimation() {
    if (this.isAnimating) return;
    
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.time.delta = this.clock.getDelta();
      this.time.elapsed += this.time.delta;
      this.onBeforeRender(this.time);
      this.render();
      this.onAfterRender(this.time);
    };
    
    this.isAnimating = true;
    this.clock.start();
    animate();
  }

  private stopAnimation() {
    if (this.isAnimating) {
      cancelAnimationFrame(this.animationId!);
      this.isAnimating = false;
      this.clock.stop();
    }
  }

  private renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse((object) => {
      if (object.isMesh && typeof object.material === "object" && object.material !== null) {
        Object.keys(object.material).forEach((key) => {
          const value = object.material[key];
          if (value !== null && typeof value === "object" && typeof value.dispose === "function") {
            value.dispose();
          }
        });
        object.material.dispose();
        object.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.cleanupEventListeners();
    this.stopAnimation();
    this.clear();
    this.postprocessing?.dispose();
    this.renderer.dispose();
  }
}

// Interaction handling
const interactionMap = new Map();
const mousePosition = new Vector2();
let interactionInitialized = false;

function setupInteraction(element: HTMLElement, callbacks: any) {
  const interaction = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter() { },
    onMove() { },
    onClick() { },
    onLeave() { },
    ...callbacks,
  };

  if (!interactionMap.has(element)) {
    interactionMap.set(element, interaction);
    if (!interactionInitialized) {
      document.body.addEventListener("pointermove", handlePointerMove);
      document.body.addEventListener("pointerleave", handlePointerLeave);
      document.body.addEventListener("click", handleClick);
      document.body.addEventListener("touchstart", handleTouchStart, { passive: false });
      document.body.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.body.addEventListener("touchend", handleTouchEnd, { passive: false });
      document.body.addEventListener("touchcancel", handleTouchEnd, { passive: false });
      interactionInitialized = true;
    }
  }

  interaction.dispose = () => {
    interactionMap.delete(element);
    if (interactionMap.size === 0) {
      document.body.removeEventListener("pointermove", handlePointerMove);
      document.body.removeEventListener("pointerleave", handlePointerLeave);
      document.body.removeEventListener("click", handleClick);
      document.body.removeEventListener("touchstart", handleTouchStart);
      document.body.removeEventListener("touchmove", handleTouchMove);
      document.body.removeEventListener("touchend", handleTouchEnd);
      document.body.removeEventListener("touchcancel", handleTouchEnd);
      interactionInitialized = false;
    }
  };

  return interaction;
}

function handlePointerMove(event: PointerEvent) {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
  processInteraction();
}

function processInteraction() {
  for (const [element, interaction] of interactionMap) {
    const rect = element.getBoundingClientRect();
    if (isInBounds(rect)) {
      updateInteractionPosition(interaction, rect);
      if (!interaction.hover) {
        interaction.hover = true;
        interaction.onEnter(interaction);
      }
      interaction.onMove(interaction);
    } else if (interaction.hover && !interaction.touching) {
      interaction.hover = false;
      interaction.onLeave(interaction);
    }
  }
}

function handleClick(event: MouseEvent) {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
  for (const [element, interaction] of interactionMap) {
    const rect = element.getBoundingClientRect();
    updateInteractionPosition(interaction, rect);
    if (isInBounds(rect)) interaction.onClick(interaction);
  }
}

function handlePointerLeave() {
  for (const interaction of interactionMap.values()) {
    if (interaction.hover) {
      interaction.hover = false;
      interaction.onLeave(interaction);
    }
  }
}

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length > 0) {
    event.preventDefault();
    mousePosition.x = event.touches[0].clientX;
    mousePosition.y = event.touches[0].clientY;

    for (const [element, interaction] of interactionMap) {
      const rect = element.getBoundingClientRect();
      if (isInBounds(rect)) {
        interaction.touching = true;
        updateInteractionPosition(interaction, rect);
        if (!interaction.hover) {
          interaction.hover = true;
          interaction.onEnter(interaction);
        }
        interaction.onMove(interaction);
      }
    }
  }
}

function handleTouchMove(event: TouchEvent) {
  if (event.touches.length > 0) {
    event.preventDefault();
    mousePosition.x = event.touches[0].clientX;
    mousePosition.y = event.touches[0].clientY;

    for (const [element, interaction] of interactionMap) {
      const rect = element.getBoundingClientRect();
      updateInteractionPosition(interaction, rect);

      if (isInBounds(rect)) {
        if (!interaction.hover) {
          interaction.hover = true;
          interaction.touching = true;
          interaction.onEnter(interaction);
        }
        interaction.onMove(interaction);
      } else if (interaction.hover && interaction.touching) {
        interaction.onMove(interaction);
      }
    }
  }
}

function handleTouchEnd() {
  for (const [, interaction] of interactionMap) {
    if (interaction.touching) {
      interaction.touching = false;
      if (interaction.hover) {
        interaction.hover = false;
        interaction.onLeave(interaction);
      }
    }
  }
}

function updateInteractionPosition(interaction: any, rect: DOMRect) {
  const { position, nPosition } = interaction;
  position.x = mousePosition.x - rect.left;
  position.y = mousePosition.y - rect.top;
  nPosition.x = (position.x / rect.width) * 2 - 1;
  nPosition.y = (-position.y / rect.height) * 2 + 1;
}

function isInBounds(rect: DOMRect) {
  const { x, y } = mousePosition;
  const { left, top, width, height } = rect;
  return x >= left && x <= left + width && y >= top && y <= top + height;
}

// Physics and rendering classes
const { randFloat, randFloatSpread } = MathUtils;
const tempVector1 = new Vector3();
const tempVector2 = new Vector3();
const tempVector3 = new Vector3();
const tempVector4 = new Vector3();
const tempVector5 = new Vector3();
const tempVector6 = new Vector3();
const tempVector7 = new Vector3();
const tempVector8 = new Vector3();
const tempVector9 = new Vector3();
const tempVector10 = new Vector3();

class PhysicsEngine {
  config: any;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center: Vector3;

  constructor(config: any) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new Vector3();
    this.initializePositions();
    this.setSizes();
  }

  private initializePositions() {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    for (let i = 1; i < config.count; i++) {
      const base = 3 * i;
      positionData[base] = randFloatSpread(2 * config.maxX);
      positionData[base + 1] = randFloatSpread(2 * config.maxY);
      positionData[base + 2] = randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i++) {
      sizeData[i] = randFloat(config.minSize, config.maxSize);
    }
  }

  update(time: any) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let controlIndex = 0;
    
    if (config.controlSphere0) {
      controlIndex = 1;
      tempVector1.fromArray(positionData, 0);
      tempVector1.lerp(center, 0.1).toArray(positionData, 0);
      tempVector4.set(0, 0, 0).toArray(velocityData, 0);
    }
    
    // Update velocities
    for (let idx = controlIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      tempVector2.fromArray(positionData, base);
      tempVector5.fromArray(velocityData, base);
      tempVector5.y -= time.delta * config.gravity * sizeData[idx];
      tempVector5.multiplyScalar(config.friction);
      tempVector5.clampLength(0, config.maxVelocity);
      tempVector2.add(tempVector5);
      tempVector2.toArray(positionData, base);
      tempVector5.toArray(velocityData, base);
    }
    
    // Handle collisions
    for (let idx = controlIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      tempVector2.fromArray(positionData, base);
      tempVector5.fromArray(velocityData, base);
      const radius = sizeData[idx];
      
      // Sphere-sphere collisions
      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        tempVector3.fromArray(positionData, otherBase);
        tempVector6.fromArray(velocityData, otherBase);
        const otherRadius = sizeData[jdx];
        tempVector7.copy(tempVector3).sub(tempVector2);
        const dist = tempVector7.length();
        const sumRadius = radius + otherRadius;
        
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          tempVector8.copy(tempVector7).normalize().multiplyScalar(0.5 * overlap);
          tempVector9.copy(tempVector8).multiplyScalar(Math.max(tempVector5.length(), 1));
          tempVector10.copy(tempVector8).multiplyScalar(Math.max(tempVector6.length(), 1));
          tempVector2.sub(tempVector8);
          tempVector5.sub(tempVector9);
          tempVector2.toArray(positionData, base);
          tempVector5.toArray(velocityData, base);
          tempVector3.add(tempVector8);
          tempVector6.add(tempVector10);
          tempVector3.toArray(positionData, otherBase);
          tempVector6.toArray(velocityData, otherBase);
        }
      }
      
      // Control sphere collision
      if (config.controlSphere0) {
        tempVector7.copy(tempVector1).sub(tempVector2);
        const dist = tempVector7.length();
        const sumRadius0 = radius + sizeData[0];
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist;
          tempVector8.copy(tempVector7.normalize()).multiplyScalar(diff);
          tempVector9.copy(tempVector8).multiplyScalar(Math.max(tempVector5.length(), 2));
          tempVector2.sub(tempVector8);
          tempVector5.sub(tempVector9);
        }
      }
      
      // Boundary collisions
      if (Math.abs(tempVector2.x) + radius > config.maxX) {
        tempVector2.x = Math.sign(tempVector2.x) * (config.maxX - radius);
        tempVector5.x = -tempVector5.x * config.wallBounce;
      }
      
      if (config.gravity === 0) {
        if (Math.abs(tempVector2.y) + radius > config.maxY) {
          tempVector2.y = Math.sign(tempVector2.y) * (config.maxY - radius);
          tempVector5.y = -tempVector5.y * config.wallBounce;
        }
      } else if (tempVector2.y - radius < -config.maxY) {
        tempVector2.y = -config.maxY + radius;
        tempVector5.y = -tempVector5.y * config.wallBounce;
      }
      
      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(tempVector2.z) + radius > maxBoundary) {
        tempVector2.z = Math.sign(tempVector2.z) * (config.maxZ - radius);
        tempVector5.z = -tempVector5.z * config.wallBounce;
      }
      
      tempVector2.toArray(positionData, base);
      tempVector5.toArray(velocityData, base);
    }
  }
}

class CustomMaterial extends MeshPhysicalMaterial {
  uniforms: any;
  
  constructor(params: any) {
    super(params);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };
    this.defines.USE_UV = "";
    
    this.onBeforeCompile = (shader: any) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        "\n        uniform float thicknessPower;\n        uniform float thicknessScale;\n        uniform float thicknessDistortion;\n        uniform float thicknessAmbient;\n        uniform float thicknessAttenuation;\n      " +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        "\n        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {\n          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));\n          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n          #ifdef USE_COLOR\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;\n          #else\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;\n          #endif\n          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n        }\n\n        void main() {\n      "
      );
      const lightsFragment = ShaderChunk.lights_fragment_begin.replaceAll(
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",
        "\n          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);\n        "
      );
      shader.fragmentShader = shader.fragmentShader.replace("#include <lights_fragment_begin>", lightsFragment);
    };
  }
}

const defaultConfig = {
  count: 200,
  colors: [0, 0, 0],
  ambientColor: 16777215,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true
};

const tempObject = new Object3D();

class SpheresGroup extends InstancedMesh {
  config: any;
  physics: PhysicsEngine;
  ambientLight: AmbientLight;
  light: PointLight;

  constructor(renderer: WebGLRenderer, config = {}) {
    const finalConfig = { ...defaultConfig, ...config };
    const environment = new RoomEnvironment();
    const pmremGenerator = new PMREMGenerator(renderer, 0.04);
    const envMap = pmremGenerator.fromScene(environment).texture;
    const geometry = new SphereGeometry();
    const material = new CustomMaterial({ envMap, ...finalConfig.materialParams });
    material.envMapRotation.x = -Math.PI / 2;
    
    super(geometry, material, finalConfig.count);
    this.config = finalConfig;
    this.physics = new PhysicsEngine(finalConfig);
    this.setupLights();
    this.setColors(finalConfig.colors);
  }

  private setupLights() {
    this.ambientLight = new AmbientLight(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(this.config.colors[0], this.config.lightIntensity);
    this.add(this.light);
  }

  setColors(colors: number[]) {
    if (Array.isArray(colors) && colors.length > 1) {
      const colorInterpolator = this.createColorInterpolator(colors);
      for (let idx = 0; idx < this.count; idx++) {
        this.setColorAt(idx, colorInterpolator.getColorAt(idx / this.count));
        if (idx === 0) {
          this.light.color.copy(colorInterpolator.getColorAt(idx / this.count));
        }
      }
      this.instanceColor.needsUpdate = true;
    }
  }

  private createColorInterpolator(colors: number[]) {
    let colorArray: number[];
    let colorObjects: Color[];
    
    function setColors(colors: number[]) {
      colorArray = colors;
      colorObjects = [];
      colorArray.forEach((col) => {
        colorObjects.push(new Color(col));
      });
    }
    
    setColors(colors);
    
    return {
      setColors,
      getColorAt: function (ratio: number, out = new Color()) {
        const scaled = Math.max(0, Math.min(1, ratio)) * (colorArray.length - 1);
        const idx = Math.floor(scaled);
        const start = colorObjects[idx];
        if (idx >= colorArray.length - 1) return start.clone();
        const alpha = scaled - idx;
        const end = colorObjects[idx + 1];
        out.r = start.r + alpha * (end.r - start.r);
        out.g = start.g + alpha * (end.g - start.g);
        out.b = start.b + alpha * (end.b - start.b);
        return out;
      },
    };
  }

  update(time: any) {
    this.physics.update(time);
    for (let idx = 0; idx < this.count; idx++) {
      tempObject.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        tempObject.scale.setScalar(0);
      } else {
        tempObject.scale.setScalar(this.physics.sizeData[idx]);
      }
      tempObject.updateMatrix();
      this.setMatrixAt(idx, tempObject.matrix);
      if (idx === 0) this.light.position.copy(tempObject.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(canvas: HTMLCanvasElement, config = {}) {
  const renderer = new ThreeRenderer({
    canvas,
    size: "parent",
    rendererOptions: { antialias: true, alpha: true },
  });
  
  let spheres: SpheresGroup;
  renderer.renderer.toneMapping = ACESFilmicToneMapping;
  renderer.camera.position.set(0, 0, 20);
  renderer.camera.lookAt(0, 0, 0);
  renderer.cameraMaxAspect = 1.5;
  renderer.resize();
  
  function initialize(config: any) {
    if (spheres) {
      renderer.clear();
      renderer.scene.remove(spheres);
    }
    spheres = new SpheresGroup(renderer.renderer, config);
    renderer.scene.add(spheres);
  }
  
  initialize(config);
  
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersectionPoint = new Vector3();
  let isPaused = false;

  canvas.style.touchAction = 'none';
  canvas.style.userSelect = 'none';
  canvas.style.webkitUserSelect = 'none';

  const interaction = setupInteraction(canvas, {
    onMove() {
      raycaster.setFromCamera(interaction.nPosition, renderer.camera);
      renderer.camera.getWorldDirection(plane.normal);
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      spheres.physics.center.copy(intersectionPoint);
      spheres.config.controlSphere0 = true;
    },
    onLeave() {
      spheres.config.controlSphere0 = false;
    },
  });

  renderer.onBeforeRender = (time: any) => {
    if (!isPaused) spheres.update(time);
  };
  
  renderer.onAfterResize = (size: any) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };

  return {
    three: renderer,
    get spheres() {
      return spheres;
    },
    setCount(count: number) {
      initialize({ ...spheres.config, count });
    },
    togglePause() {
      isPaused = !isPaused;
    },
    dispose() {
      interaction.dispose();
      renderer.dispose();
    },
  };
}

const Ballpit: React.FC<BallpitProps> = ({ 
  className = '', 
  followCursor = true, 
  ...props 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spheresInstanceRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    spheresInstanceRef.current = createBallpit(canvas, { followCursor, ...props });

    return () => {
      if (spheresInstanceRef.current) {
        spheresInstanceRef.current.dispose();
      }
    };
  }, [followCursor, props]);

  return (
    <canvas
      className={`${className} w-full h-full`}
      ref={canvasRef}
    />
  );
};

export default Ballpit;
