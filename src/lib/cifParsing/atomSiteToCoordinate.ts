export default function atomSiteToCoordinate(atomSite: AtomSite): Coordinate {
  return {
    element: atomSite.type_symbol,
    x: atomSite.Cartn_x,
    y: atomSite.Cartn_y,
    z: atomSite.Cartn_z,
  };
}
