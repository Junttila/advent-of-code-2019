import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as math from "mathjs";
const {
  checkIntersection,
  colinearPointWithinSegment 
} = require('line-intersect');
const results = [];
 
fs.createReadStream('input.txt')
  .pipe(csv())
  .on('data', (data) => {
    results.push(Object.keys(data));
    results.push(Object.values(data));
  })
  .on('end', () => {
    //console.log(intersects({ from: { x: 0, y: 0 }, to: { x: 75, y: 0 } }, { from: { x: 0, y: 0 }, to: { x: 0, y: 62 } }));
    const trace1 = trace(results[0]);
    const trace2 = trace(results[1]);

    const intersections: Array<Point & {steps: number}> = [];

    for (const l1 of trace1) {
      for (const l2 of trace2) {
        const intersectsAt = {
          ...intersects(l1, l2),
          steps: 0,
        };
        if (intersectsAt.x) {
          intersectsAt.steps += l1.steps+l2.steps;
          intersectsAt.steps += math.distance([l1.from.x, l1.from.y], [intersectsAt.x, intersectsAt.y]) as number;
          intersectsAt.steps += math.distance([l2.from.x, l2.from.y], [intersectsAt.x, intersectsAt.y]) as number;
          console.log(intersectsAt);
          intersections.push(intersectsAt);
        }
      }
    }
    //const sorted = intersections.sort((a,b) => (Math.abs(a.x) + Math.abs(a.y)) - (Math.abs(b.x) + Math.abs(b.y))).filter((p) => (Math.abs(p.x) + Math.abs(p.y)) !== 0);
    const sorted = intersections.sort((a,b) => a.steps - b.steps).filter((p) => p.steps !== 0);

    console.log(sorted[0].steps);
  });

function trace(wire: string[]) {
  let x = 0;
  let y = 0;
  let steps = 0;

  const trace: Array<Line & {steps: number}> = [];

  for (const dir of wire) {
    const line: Line & {steps: number} = {
      from: {
        x: x.valueOf(),
        y: y.valueOf(),
      },
      to: undefined,
      steps: undefined,
    }
    line.steps = steps;
    switch(dir[0]) {
      case "U":
        y += Number(dir.substring(1));
        break;
      case "D":
        y -= Number(dir.substring(1));
        break;
      case "L":
        x -= Number(dir.substring(1));
        break;
      case "R":
        x += Number(dir.substring(1));
        break;
    }
    steps += Number(dir.substring(1));
    line.to = {
      x: x.valueOf(),
      y: y.valueOf(),
    };
    console.log(steps);
    trace.push(line);
  }

  return trace;
}

function intersects(line1: Line, line2: Line): Point {
  const intersection: {
    type: 'none' | 'parallel' | 'colinear' | 'intersecting',
    point: {
      x: number,
      y: number,
    }
  } = checkIntersection(
    line1.from.x,line1.from.y,
    line1.to.x,line1.to.y,
    line2.from.x,line2.from.y,
    line2.to.x,line2.to.y
  );
  if (!intersection.point) {
    return null;
  }
  return intersection.point;
}

export function linePositions(line: Line) {
  const points: Point[] = [];
  let x = line.from.x;
  let y = line.from.y;

  if (line.from.y === line.to.y) {
    while(x !== line.to.x) {
      points.push({x, y});
      x += x < line.to.x ? 1 : 
      x > line.to.x ? -1 :
      0;
    }
  }
  if (line.from.x === line.to.x) {
    while(y !== line.to.y) {
      points.push({x, y});
      y += 
        y < line.to.y ? 1 : 
        y > line.to.y ? -1 :
        0;
    }
  }
  points.push({x, y});

  return points;
}

interface Line {
  from: Point,
  to: Point,
}

interface Point {
  x: number,
  y: number,
}

