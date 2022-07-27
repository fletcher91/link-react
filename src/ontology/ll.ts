import { createNS } from "@ontologies/core";

const ll = createNS("http://purl.org/link-lib/");

export default {
  ns: ll,

  /* classes */
  ErrorResource: ll("ErrorResource"),
  LoadingResource: ll("LoadingResource"),
  NoView: ll("NoView"),

  /* properties */
  clonedFrom: ll("clonedFrom"),
  /** Used internally by link to ensure data consistency */
  dataSubject: ll("dataSubject"),
  meta: ll("meta"),

  /* individuals */
  /** No-operation, used internally by link when information is not needed. */
  nop: ll("nop"),
};
