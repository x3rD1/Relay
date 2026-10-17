export function relevantPolicies(policies: { [key: string]: number }) {
  return Object.entries(policies)
    .filter(([policy, probability]) => {
      if (policy === "other") return false;

      return probability > 0;
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([policy]) => policy);
}
