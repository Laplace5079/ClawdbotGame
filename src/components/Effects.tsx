import { EffectComposer, Bloom, SSAO, Noise, Vignette } from '@react-three/postprocessing';
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
        intensity={1.0} 
        luminanceThreshold={0.9} 
        luminanceSmoothing={0.025} 
        mipmapBlur 
      />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};
