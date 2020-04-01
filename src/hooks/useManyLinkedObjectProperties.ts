import { Quad, SomeTerm } from "@ontologies/core";
import { getPropBestLangRaw } from "link-lib";
import React from "react";

import { DataToPropsMapping } from "../hocs/link/dataPropsToPropMap";
import { toReturnType } from "../hocs/link/toReturnType";
import { ReturnType, ToJSOutputTypes } from "../types";

import { useLRS } from "./useLRS";

export function useManyLinkedObjectProperties(
  subjPropsArr: Quad[][],
  propMap: DataToPropsMapping,
  returnType?: ReturnType,
) {
  const lrs = useLRS();
  const values = React.useMemo(() => Object.values(propMap), [propMap]);
  const length = subjPropsArr.length;

  return React.useMemo(
    () => {
      const propMaps = [];

      for (let h = 0; h < length; h++) {
        const subjProps = subjPropsArr[h];
        const subject = subjProps[0]?.subject;
        const acc: { [s: string]: Quad | SomeTerm | ToJSOutputTypes } = {
          subject,
        };

        for (let i = 0, ilen = values.length; i < ilen; i++) {
          const propOpts = values[i];
          for (let j = 0, jlen = propOpts.label.length; j < jlen; j++) {
            const cur = propOpts.label[j];
            if (acc[propOpts.name]) {
              // TODO: Merge
              continue;
            }
            if (propOpts.limit === 1) {
              const p = getPropBestLangRaw(
                lrs.getResourcePropertyRaw(subject, cur),
                (lrs.store as any).langPrefs,
              );
              if (p) {
                acc[propOpts.name] = toReturnType(propOpts.returnType || returnType, p);
              }
            } else {
              const nextName = [];
              for (let k = 0, klen = subjProps.length; k < klen; k++) {
                if (subjProps[k].predicate === cur) {
                  nextName.push(toReturnType(propOpts.returnType || returnType, subjProps[k]));
                }
              }
              acc[propOpts.name] = nextName;
            }
          }
        }
        propMaps.push(acc);
      }

      return propMaps;
    },
    [lrs, subjPropsArr, values],
  );
}
