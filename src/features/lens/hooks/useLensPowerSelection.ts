import { useCallback, useMemo, useState } from "react";
import { LENS_DETAIL_COPY } from "@/features/lens/constants";
import {
  buildLensPowerOptions,
  getLensTotalMax,
  isPowerOverTotalMax,
} from "@/features/lens/utils/detail";
import type {
  LensEye,
  LensEyeValues,
  LensItem,
  LensPowerDetails,
  LensPowerField,
  LensPowerFieldConfig,
  LensPowerSelectionState,
} from "@/features/lens/types";

const EYES: readonly LensEye[] = ["right", "left"];
const EMPTY_VALUES: LensEyeValues = { sph: "", cyl: "", add: "" };

const INITIAL_STATE: LensPowerSelectionState = {
  selectedEyes: { right: true, left: true },
  values: { right: EMPTY_VALUES, left: EMPTY_VALUES },
};

export function useLensPowerSelection(lens: LensItem) {
  const [selectedEyes, setSelectedEyes] = useState<Record<LensEye, boolean>>(
    INITIAL_STATE.selectedEyes
  );
  const [values, setValues] = useState<Record<LensEye, LensEyeValues>>(
    INITIAL_STATE.values
  );

  const options = useMemo(() => buildLensPowerOptions(lens), [lens]);

  const fields = useMemo<LensPowerFieldConfig[]>(() => {
    const list: LensPowerFieldConfig[] = [];
    if (options.hasSph) {
      list.push({ key: "sph", label: LENS_DETAIL_COPY.sph, values: options.sph });
    }
    if (options.hasCyl) {
      list.push({ key: "cyl", label: LENS_DETAIL_COPY.cyl, values: options.cyl });
    }
    if (options.hasAdd) {
      list.push({ key: "add", label: LENS_DETAIL_COPY.add, values: options.add });
    }
    return list;
  }, [options]);

  const toggleEye = useCallback((eye: LensEye) => {
    setSelectedEyes((current) => ({ ...current, [eye]: !current[eye] }));
  }, []);

  const setField = useCallback(
    (eye: LensEye, field: LensPowerField, value: string) => {
      setValues((current) => ({
        ...current,
        [eye]: { ...current[eye], [field]: value },
      }));
    },
    []
  );

  const selectedEyeList = useMemo(
    () => EYES.filter((eye) => selectedEyes[eye]),
    [selectedEyes]
  );

  const totalMax = useMemo(() => getLensTotalMax(lens), [lens]);

  const overLimitEyes = useMemo(
    () =>
      selectedEyeList.filter((eye) =>
        isPowerOverTotalMax(values[eye].sph, values[eye].cyl, totalMax)
      ),
    [selectedEyeList, totalMax, values]
  );

  const isComplete = useMemo(() => {
    if (fields.length === 0) return true;
    if (selectedEyeList.length === 0) return false;
    if (overLimitEyes.length > 0) return false;
    return selectedEyeList.every((eye) =>
      fields.every((field) => values[eye][field.key] !== "")
    );
  }, [fields, overLimitEyes, selectedEyeList, values]);

  const powerDetails = useMemo<LensPowerDetails | null>(() => {
    if (!isComplete || fields.length === 0 || selectedEyeList.length === 0) {
      return null;
    }

    const details: LensPowerDetails = {
      hasCylindrical: options.hasCyl,
    };

    if (selectedEyeList.length === EYES.length) {
      details.isSamePower = fields.every(
        (field) => values.right[field.key] === values.left[field.key]
      );
    }

    if (selectedEyes.right) {
      details.rightSPH = values.right.sph || undefined;
      details.rightCYL = values.right.cyl || undefined;
      details.rightADD = values.right.add || undefined;
    }
    if (selectedEyes.left) {
      details.leftSPH = values.left.sph || undefined;
      details.leftCYL = values.left.cyl || undefined;
      details.leftADD = values.left.add || undefined;
    }

    return details;
  }, [fields, isComplete, options.hasCyl, selectedEyeList, selectedEyes, values]);

  return {
    fields,
    selectedEyes,
    values,
    selectedEyeList,
    isComplete,
    totalMax,
    overLimitEyes,
    powerDetails,
    toggleEye,
    setField,
  };
}
