export default function stringToAtomSite(atomSite: string): AtomSite {
  const fields = atomSite.trim().split(/\s+/);

  if (fields.length < 21) {
    throw new Error(
      `Invalid _atom_site line: expected 21 fields, got ${fields.length}. Line: "${atomSite}"`
    );
  }

  return {
    group_PDB: fields[0],
    id: fields[1],
    type_symbol: fields[2],
    label_atom_id: fields[3],
    label_alt_id: fields[4],
    label_comp_id: fields[5],
    label_asym_id: fields[6],
    label_entity_id: fields[7],
    label_seq_id: fields[8],
    pdbx_PDB_ins_code: fields[9],
    Cartn_x: parseFloat(fields[10]),
    Cartn_y: parseFloat(fields[11]),
    Cartn_z: parseFloat(fields[12]),
    occupancy: parseFloat(fields[13]),
    B_iso_or_equiv: parseFloat(fields[14]),
    pdbx_formal_charge: fields[15],
    auth_seq_id: fields[16],
    auth_comp_id: fields[17],
    auth_asym_id: fields[18],
    auth_atom_id: fields[19],
    pdbx_PDB_model_num: fields[20],
  };
}
