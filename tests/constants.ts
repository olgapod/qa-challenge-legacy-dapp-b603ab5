export const actionTypesRegexMap = {
  MINT: /^Mint\s+\S+\s+\S+$/, // Matches "Mint <amount> <symbol>"
  PAYMENT: /^Pay\s+\S+\s+\S+\s+\S+$/, // Matches "Pay <user> <amount> <symbol>"
  TRANSFER: /^Move\s+\S+\s+\S+\s+from\s+\S+\s+to\s+\S+$/, // Matches "Move <amount> <symbol> from <team> to <team>"
  REPUTATION:
    /^Awarded\s+\S+\s+with\s+a\s+\S+\s+points\s+reputation\s+award$/, // Matches "Awarded <user> with a <amount> points reputation award"
  PERMISSIONS:
    /^Assign\s+the\s+\S+\s+permissions\s+in\s+\S+\s+to\s+\S+$/, // Matches "Assign the <comma-separated-roles> permissions in <team> to <user>"
  UPGRADE: /^Upgrade\s+to\s+version\s+\S+$/, // Matches "Upgrade to version <version>"
  DETAILS: /^Details\s+changed$/, // Matches "Details changed"
  ADDRESS: /^Address\s+book\s+was\s+updated$/, // Matches "Address book was updated"
  TEAM: /^New\s+team:\s+\S+$/, // Matches "New team: <team>"
  GENERIC: /^Generic\s+Action$/, // Matches "Generic Action"
};
