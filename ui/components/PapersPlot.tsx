import { Suspense, useRef, useState, useLayoutEffect, forwardRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Points, Point, MapControls, Html, PointMaterialImpl } from '@react-three/drei';
import { Box, Text } from '@styles/components';
import { css } from '@styles/config';
import * as THREE from 'three';

const colors = [
  '#bdc3c7',
  '#f1c40f',
  '#f39c12',
  '#e74c3c',
  '#ff6b81',
  '#9b59b6',
  '#3498db',
  '#2ecc71',
  '#1abc9c',
  '#2980b9',
  '#c0392b',
  '#8e44ad',
  '#7ed6df',
  '#686de0',
  '#6ab04c',
  '#7bed9f',
  '#e056fd',
  '#4834d4',
];

const hoverBox = css({
  width: '$7',
  position: 'absolute',
  textAlign: 'center',
  pointerEvents: 'none',
  backgroundColor: '$contrast2',
  border: '1.5px solid $contrast4',
  borderRadius: '$2',
  p: '$1',
  ':before': {
    content: '',
    position: 'absolute',
    left: '50%',                    
    marginLeft: '-8px',           
    bottom: '-16px',
    border: 'solid 8px transparent',
    borderTopColor: '$contrast4'
  }
})

export default function PapersPlot({ papers, onClick, ...props }) {

  const [hovered, setHovered] = useState(null)
  const [selected, setSeleted] = useState(0)

  useLayoutEffect(() => {
    setSeleted(0)
    onClick(0)
  }, [])

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 250], up: [0, 0, 1], far: 10000 }} {...props}>
      <ambientLight />
      <MapControls enableDamping={false} />

      <Points
        limit={1000} // Optional: max amount of items (for calculating buffer size)
        range={1000} // Optional: draw-range
      >
        <PointMaterial scale={35} />
        {papers.map((paper, idx) => (
          <Point
            key={idx}
            position={[paper.position.x, paper.position.y, 0]}
            color={colors[paper.cluster + 1]}
            onClick={(e) => {
              e.stopPropagation() 
              onClick(idx);
              setSeleted(idx)
              setHovered(null)
            }}
            onPointerEnter={() => setHovered(idx) }
          >

            { hovered === idx ? (
              <Html className={ hoverBox() } style={{ transform: 'translateX(-50%) translateY(-100%) translateY(-16px)', zIndex: 10 }}  zIndexRange={[19, 10]}>
                <Text css={{ lineHeight: '$3'}}>{paper.title}</Text>
              </Html>
            ) : null }

            { selected === idx ? (
              <Html center style={{position: 'absolute', pointerEvents: 'none', zIndex: 1 }} zIndexRange={[9, 1]}>
                <svg style={{ width: '50px', height: '50px'}}>
                  <circle cx="25" cy="27" r="16" fill={'transparent'} stroke={colors[paper.cluster + 1]} strokeWidth={3}/>
                </svg>
              </Html>
            ) : null }
            
          </Point>
        ))}
      </Points>
    </Canvas>
  );
}

const PointMaterial = forwardRef((props, ref) => {
  const [material] = useState(() => new PointMaterialImpl());

  useFrame(({ raycaster, camera }) => {
    raycaster.params.Points.threshold = (props.scale * camera.position.z) / 2100;
  });

  return <primitive object={material} ref={ref} attach="material" {...props} />;
});
