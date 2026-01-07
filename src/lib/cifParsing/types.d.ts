// This type is created based on the 70th section of the cif file
type AtomSite = {
  group_PDB: string;
  id: string;
  type_symbol: string;
  label_atom_id: string;
  label_alt_id: string;
  label_comp_id: string;
  label_asym_id: string;
  label_entity_id: string;
  label_seq_id: string;
  pdbx_PDB_ins_code: string;
  Cartn_x: number;
  Cartn_y: number;
  Cartn_z: number;
  occupancy: number;
  B_iso_or_equiv: number;
  pdbx_formal_charge: string;
  auth_seq_id: string;
  auth_comp_id: string;
  auth_asym_id: string;
  auth_atom_id: string;
  pdbx_PDB_model_num: string;
};

// This is a type for the point that I want to represent
// The x,y,z are coordinates and the type_symbol is the type of element the atom is (I think?)
// We'll later colour by atom type
type Coordinate = {
  element: string;
  x: number;
  y: number;
  z: number;
};

// This type contains metadata about the protein structure
type ProteinMetadata = {
  name?: string; // Common name from _entity_name_com.name
  description?: string; // Description from _entity.pdbx_description
};
