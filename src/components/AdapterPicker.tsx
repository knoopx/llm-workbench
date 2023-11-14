import { observer } from "mobx-react";
import { Picker } from "@/components/Picker";
import { Instance } from "mobx-state-tree";
import { Agent } from "@/store/Agent";
import { AdapterList } from "@/lib/adapters";

export const AdapterPicker: React.FC<{
  agent: Instance<typeof Agent>;
}> = observer(({ agent }) => {
  const options = AdapterList.map((adapter) => ({
    key: adapter,
    value: adapter,
  }));

  return (
    <div className="space-y-2">
      <span className="font-medium">Adapter</span>
      <Picker
        value={agent.adapter.type}
        options={options}
        onChange={(type) => {
          agent.adapter.update({ type });
          if (agent.adapter.baseUrl == "") {
            if (agent.adapter.type == "Ollama") {
              agent.adapter.update({ baseUrl: "http://localhost:11434" });
            } else if (agent.adapter.type == "HuggingFace") {
              agent.adapter.update({ baseUrl: "http://localhost:8080" });
            }
          }
        }} />
    </div>
  );
});
