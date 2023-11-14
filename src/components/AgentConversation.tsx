import { observer } from "mobx-react";
import { Input } from "@/components/ui/input";
import { AgentHistory } from "./AgentHistory";
import { AgentPromptTemplate } from "./AgentPromptTemplate";
import { Button } from "@/components/ui/button";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { AutoTextarea } from "@/components/AutoTextarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const AgentConversation = observer(({ agent }) => (
  <div className="space-y-8">
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">Conversation History</span>
        <Button size="icon" variant="ghost" onClick={() => agent.addMessage()}>
          <IoMdAdd />
        </Button>
      </div>

      <AgentHistory agent={agent} />
    </div>

    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">Templates</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <IoMdAdd />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-80 space-y-1"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "Escape" })
                );
                agent.addTemplate({ id: e.target.elements.id.value });
              }}
            >
              <Input name="id" autoFocus />
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 bg-muted rounded p-2">
        <div className="flex flex-col space-y-4">
          {agent.templates.map((template) => (
            <div key={template.id} className="flex-auto space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{template.id}</div>
                <button
                  onClick={() => {
                    agent.remove(template);
                  }}
                >
                  <IoMdTrash />
                </button>
              </div>

              <AutoTextarea
                value={template.content}
                onChange={(e) => {
                  template.update({ content: e.target.value });
                }} />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <span className="font-medium">Prompt Template</span>
      <AgentPromptTemplate agent={agent} />
      <span className="flex flex-col space-y-2">
        <span className="font-medium">Preview</span>
        <div className="w-95 text-xs font-mono whitespace-pre overflow-auto bg-muted p-4 rounded-md">
          {agent.promptPreview}
        </div>
      </span>
    </div>
  </div>
));
