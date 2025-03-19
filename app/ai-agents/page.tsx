import { AgentChat } from '@/components/ai-agents/agent-chat';

export default function AIAgentsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">AI Agents</h1>
        <p className="text-muted-foreground">
          Multi-step AI processing with model switching. The primary model handles research using
          Tavily search, while the secondary model processes and refines the results.
        </p>
      </div>
      <AgentChat />
    </div>
  );
}
