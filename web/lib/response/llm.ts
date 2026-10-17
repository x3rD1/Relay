import { ai } from "../clients/ai";

interface SelectedSection {
  title: string;
  content: string;
}

const systemInstructions = `
  You are a real-time copilot for a customer-service agent handling a live conversation.

  Write the exact message the agent should say to the customer next.
  Speak directly to the customer using natural, conversational language.
  Do not summarize, quote, or explain the policy.
  Focus on the next appropriate step in the conversation.
  Ask only for the information needed at this stage.
  Be empathetic, concise, and professional.
  Never promise an outcome or invent policies, requirements, deadlines, or exceptions.
  Use only the provided policy section to determine what actions are appropriate.
  If the policy doesn't provide enough information to respond safely, ask a relevant clarifying question or briefly state what needs to be verified.
  Return only the message the agent should say, without commentary or reasoning.
`;

export async function generateResponse(
  question: string,
  section: SelectedSection,
) {
  const instruction = {
    policy_section: section.title,
    policy_content: section.content,
    customer_question: question,
  };

  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    system_instruction: systemInstructions,
    input: JSON.stringify(instruction),
  });

  return interaction.output_text ?? "";
}
