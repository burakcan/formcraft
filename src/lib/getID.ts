import { nanoid } from "nanoid";

export function getPageID() {
  return `pg_${nanoid(6)}`;
}

export function getThemeID() {
  return `th_${nanoid(6)}`;
}

export function getConditionID() {
  return `cd_${nanoid(6)}`;
}

export function getNodeID() {
  return `nd_${nanoid(6)}`;
}

export function getEdgeID() {
  return `ed_${nanoid(6)}`;
}

export function getOptionID() {
  return `op_${nanoid(3)}`;
}
