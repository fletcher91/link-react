import { NamedNode } from "@ontologies/core";
import { RENDER_CLASS_NAME } from "link-lib";
import React, { ReactNode } from "react";

import { useCalculateChildProps } from "../hooks/useCalculateChildProps";
import { normalizeDataSubjects, useDataInvalidation } from "../hooks/useDataInvalidation";
import { useLinkRenderContext } from "../hooks/useLinkRenderContext";
import { useRenderLoadingOrError } from "../hooks/useLoadingOrError";
import { useLRS } from "../hooks/useLRS";
import { useResourcePropertyView } from "../hooks/useResourcePropertyView";
import { SubjectProp } from "../types";

import {
    renderNoView,
    TypableInjectedProps,
    TypableProps,
} from "./Typable";

export interface PropTypes extends Partial<TypableProps> {
    children?: ReactNode | undefined;
    label?: NamedNode;
}

export interface PropTypesWithInjected extends
    Omit<PropTypes, "subject">,
    SubjectProp,
    Omit<TypableInjectedProps, "subject"> {}

export const Type = React.forwardRef((
  props: PropTypes,
  ref: React.Ref<unknown>,
): React.ReactElement | null => {
    const lrs = useLRS();
    const context = useLinkRenderContext();
    const childProps = useCalculateChildProps(props, context) as PropTypesWithInjected;
    useDataInvalidation(normalizeDataSubjects(childProps));
    const notReadyComponent = useRenderLoadingOrError(childProps);
    const component = useResourcePropertyView(
        childProps.subject,
        (childProps.label || RENDER_CLASS_NAME) as NamedNode,
        childProps.topology || childProps.topologyCtx,
    );

    if (notReadyComponent !== undefined) {
        return notReadyComponent;
    }

    if (component !== undefined && component !== null) {
        const {
            children,
            ...rest // tslint:disable-line trailing-comma
        } = childProps as {} & PropTypesWithInjected;

        return React.createElement(
            component,
          { ...rest, innerRef: ref },
            children,
        );
    }

    return renderNoView(childProps, lrs);
});
