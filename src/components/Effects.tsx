import { EffectComposer, Bloom, SSAO, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export const Effects = () => {
  return (
    <EffectComposer>
      <SSAO 
        intensity={1.5} 
        radius={0.4} 
        luminanceInfluence={0.5} 
        color={new THREE.Color("#000000")} 
      />
      <Bloom 
        intensity={1.5} 
        luminanceThreshold={0.5} 
        luminanceSmoothing={0.9} 
        mipmapBlur 
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.001, 0.001)}
      />
      <Noise opacity={0.05} />
      <Vignette eskil={false} offset={0.3} darkness={0.8} />
    </EffectComposer>
  );
};
