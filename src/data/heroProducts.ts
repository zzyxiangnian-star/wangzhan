export type HeroProduct = {
  id: string; // product id in products.json
  code: string;
  name: string;
  size: string;
  ip: string;
  img: string;
};

// Real Tyria models. Photos and specs come from the client's own datasheets.
export const HERO_PRODUCTS: HeroProduct[] = [
  { id: 'neon-flex-1220-sv-ty-ns1220v24px', code: 'TY-NS1220V24Px-Cx', name: '1220 Side View', size: '12 × 20 mm', ip: 'IP67', img: '/assets/hero/ns1220.webp' },
  { id: 'neon-flex-1615-tv-matte-black-neon-ty-nt1615bv24p', code: 'TY-NT1615BV24Px-Cx', name: '1615 Black Neon', size: '16 × 15 mm', ip: 'IP67', img: '/assets/hero/nt1615b.webp' },
  { id: 'neon-flex-360-r25-ty-nr25v24px-c', code: 'TY-NR25V24Px-Cx', name: 'R25 360° Emitting', size: 'Ø 25 mm', ip: 'IP65', img: '/assets/hero/nr25.webp' },
  { id: 'neon-flex-0612-sv-ty-ns0612v24px', code: 'TY-NS0612V24Px-Cx', name: '0612 Side View', size: '6 × 12 mm', ip: 'IP67', img: '/assets/hero/ns0612.webp' },
  { id: 'neon-flex-3d-1615-ty-n3d1615v24p', code: 'TY-N3D1615V24Px-Cx', name: '1615 3D Bend', size: '16 × 15 mm', ip: 'IP67', img: '/assets/hero/n3d1615.webp' },
  { id: 'neon-pixel-1615-tv', code: 'DMX512 · SPI', name: 'Pixel Neon', size: 'RGB addressable', ip: 'IP67', img: '/assets/hero/pixel.webp' },
  { id: 'neon-flex-d16-tv-ty-ntd16v24px', code: 'TY-NTD16V24Px-Cx', name: 'D16 Dome', size: 'Ø 16 mm', ip: 'IP67', img: '/assets/hero/ntd16.webp' },
  { id: 'neon-flex-1010-tv-three-sided-ty-n3t1010v24p', code: 'TY-N3T1010V24Px-Cx', name: '1010 Three-Sided', size: '10 × 10 mm', ip: 'IP67', img: '/assets/hero/n3t1010.webp' },
  { id: 'neon-flex-1615-tv-ty-punt1615v24', code: 'TY-PUNT1615V24PxIP68-CCx', name: '1615 PU Submersible', size: '16 × 15 mm', ip: 'IP68', img: '/assets/hero/punt1615.webp' },
  { id: 'neon-flex-2020-tv-ty-nt2020v24px', code: 'TY-NT2020V24Px-Cx', name: '2020 Top View', size: '20 × 20 mm', ip: 'IP67', img: '/assets/hero/nt2020.webp' },
  { id: 'neon-flex-1615-tv-ty-nt1615v24px', code: 'TY-NT1615V24Px-Cx', name: '1615 Top View', size: '16 × 15 mm', ip: 'IP67', img: '/assets/hero/nt1615.webp' },
];
