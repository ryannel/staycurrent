// Six-value browser order [a,b,c,d,e,f]; column vectors; multiply(A,B) = A B.
export const identity = () => [1, 0, 0, 1, 0, 0];
export const translation = (x, y) => [1, 0, 0, 1, x, y];
export const scale = (x, y = x) => [x, 0, 0, y, 0, 0];
export function rotation(degrees) {
  const angle = degrees * Math.PI / 180;
  // Exact quarter turns keep the worked snapshots exact.
  const quarter = degrees / 90;
  const c = Number.isInteger(quarter) ? [1, 0, -1, 0][((quarter % 4) + 4) % 4] : Math.cos(angle);
  const s = Number.isInteger(quarter) ? [0, 1, 0, -1][((quarter % 4) + 4) % 4] : Math.sin(angle);
  return [c, s, -s, c, 0, 0];
}
export function multiply(A, B) {
  const [a,b,c,d,e,f] = A, [g,h,i,j,k,l] = B;
  return [a*g+c*h, b*g+d*h, a*i+c*j, b*i+d*j, a*k+c*l+e, b*k+d*l+f];
}
export const compose = (...matrices) => matrices.reduce(multiply, identity());
export const point = ([a,b,c,d,e,f], p) => ({ x: a*p.x+c*p.y+e, y: b*p.x+d*p.y+f });
export const displacement = ([a,b,c,d], p) => ({ x: a*p.x+c*p.y, y: b*p.x+d*p.y });
export const determinant = ([a,b,c,d]) => a*d-b*c;
export const finitePoint = p => !!p && Number.isFinite(p.x) && Number.isFinite(p.y);
export const finiteMatrix = m => Array.isArray(m) && m.length === 6 && m.every(Number.isFinite);
export function inverse(m) {
  if (!finiteMatrix(m)) return null;
  const [a,b,c,d,e,f] = m, det = determinant(m);
  if (!Number.isFinite(det) || det === 0) return null;
  const result = [d/det, -b/det, -c/det, a/det, (c*f-d*e)/det, (b*e-a*f)/det];
  return finiteMatrix(result) ? result : null;
}
export const about = (pivot, degrees) => compose(translation(pivot.x,pivot.y), rotation(degrees), translation(-pivot.x,-pivot.y));
export const viewMatrix = ({ zoom, angle = 0, pan }) => compose(translation(pan.x,pan.y), rotation(angle), scale(zoom));
export const bridgeMatrix = ({ scale: size = 1, origin }) => compose(translation(origin.x,origin.y), scale(size));
export const svgMatrix = m => `matrix(${m.join(' ')})`;
export const add = (p,q) => ({ x: p.x+q.x, y: p.y+q.y });
export const subtract = (p,q) => ({ x: p.x-q.x, y: p.y-q.y });
