import P5, { Color } from "p5";
import { lerp } from "./utils";

interface TreeOptions {
    iterations: number;
    position: P5.Vector;
    color: Color;
    // length
    trunk_length: number;
    twig_length: number;
    // width
    trunk_width: number;
    twig_width: number;
    // branchability
    trunk_branchability: number;
    twig_branchability: number;
    max_angle_delta: number;
    branched: {
        max_angle_delta: number;
    }
}

class Branch {
    start: P5.Vector;
    end: P5.Vector;
    width: number;
    color: Color;
    length: number;
    angle: number;

    constructor(start: P5.Vector, end: P5.Vector, width: number, color: Color) {
        this.start = start;
        this.end = end;
        this.width = width;
        this.color = color;
        this.length = end.copy().sub(start).mag();
        this.angle = end.copy().sub(start).heading();
    }

    draw(p: P5) {
        p.stroke(this.color);
        p.strokeWeight(this.width);
        p.line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

}

export class Tree {
    options: TreeOptions;
    branches: Branch[] = [];

    constructor(options: TreeOptions) {
        this.options = options;

        const { position, trunk_length, trunk_width, color, iterations } = options;

        const trunk_start = position.copy();
        const trunk_end = position.copy().add(0, -trunk_length);
        const trunk = new Branch(trunk_start, trunk_end, trunk_width, color);
        this.branches.push(trunk);

        let end_branches = [trunk];
        for (let i = 0; i < iterations; i++) {
            const new_end_branches: Branch[] = [];
            for (const branch of end_branches) {
                const branches = this.branch_maybe(branch, i);
                new_end_branches.push(...branches);
                this.branches.push(...branches);
            }
            end_branches = new_end_branches;
        }
    }

    branch_maybe(branch: Branch, iteration: number): Branch[] {
        const { iterations, trunk_branchability, twig_branchability, trunk_length, trunk_width, twig_length, twig_width, max_angle_delta, branched: { max_angle_delta: max_angle_delta_branched } } = this.options;

        const has_branched = Math.random() < lerp(trunk_branchability, twig_branchability, iteration / iterations);
        const num_branches = has_branched ? 2 : 1;
        const max_angle_delta_both = has_branched ? max_angle_delta_branched : max_angle_delta;
        const branches: Branch[] = [];

        for (let i = 0; i < num_branches; i++) {
            const branch_length = lerp(trunk_length, twig_length, iteration / iterations);
            const branch_width = lerp(trunk_width, twig_width, iteration / iterations);
            const branch_color = branch.color;

            const branch_start = branch.end.copy();

            const branch_angle = branch.angle + Math.random() * max_angle_delta_both - max_angle_delta_both / 2;
            const branch_end = branch_start.copy().add(Math.cos(branch_angle) * branch_length, Math.sin(branch_angle) * branch_length);

            const new_branch = new Branch(branch_start, branch_end, branch_width, branch_color);

            branches.push(new_branch);
        }

        return branches;
    }

    draw(p: P5) {
        p.strokeCap(p.ROUND);
        for (const branch of this.branches) {
            branch.draw(p);
        }
    }
}