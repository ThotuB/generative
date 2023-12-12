import P5 from 'p5'
import { Tree } from './tree';

const sketch = (p: P5) => {
  p.setup = () => {
    p.createCanvas(1000, 1000);

    const tree = new Tree({
      position: p.createVector(500, 1000),
      trunk_length: 120,
      twig_length: 20,
      trunk_width: 40,
      twig_width: 1,
      color: p.color("#74726E"),
      trunk_branchability: 0,
      twig_branchability: 0.4,
      iterations: 30,
      max_angle_delta: Math.PI / 4,
      branched: {
        max_angle_delta: Math.PI / 2,
      }
    });


    p.background("74726E");
    tree.draw(p);
  };
}

new P5(sketch)