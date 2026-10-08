import { getAllWorkflows } from "./workflows";

export async function buildWorkflowChoices() {
  const workflows = await getAllWorkflows(); // Later: Needs userId
  const workflowCriteria = workflows.map((w) => ({
    name: w.name,
    criteria: w.criteria,
  }));

  const workflowChoices = workflowCriteria.reduce(
    (result, workflow) => {
      result[workflow.name] = workflow.criteria;

      return result;
    },
    {} as Record<string, string>,
  );

  return workflowChoices;
}
