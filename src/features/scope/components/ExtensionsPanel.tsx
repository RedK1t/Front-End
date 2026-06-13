import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import Header from "./Header";
import useProxyTraffic from "../../Interceptor/hooks/useProxyTraffic";
import useProxyActions from "../../Interceptor/hooks/useProxyActions";

// "Exclude extensions" panel for the Target Scope page. Wired to the proxy backend's
// existing scope state (scope.extensions / scope.extension_enabled) and actions.
export default function ExtensionsPanel() {
  const { scope } = useProxyTraffic();
  const { addScopeRule, removeScopeRule, toggleExtensionExclude } =
    useProxyActions();
  const [input, setInput] = useState("");

  const extensions = scope?.extensions || [];
  const isOn = scope?.extension_enabled || false;

  function handleAdd() {
    const value = input.trim().replace(/^\./, ""); // accept "js" or ".js"
    if (value) {
      addScopeRule("extension", value);
      setInput("");
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <Header
        title="Exclude"
        isOn={isOn}
        onToggle={(enabled) => toggleExtensionExclude(enabled)}
      />

      <p className="normal-text text-dark-yellowish-white">
        Items matching these rules will not be intercepted or logged in the
        history. There are some default extensions that are excluded by default —
        you can edit them if you want.
      </p>

      {/* Add row */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="js"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="bg-gray rounded-6px text-yellowish-white w-full px-4 py-2 outline-0"
        />
        <button
          onClick={handleAdd}
          className="bg-red hover:bg-light-red rounded-6px small-text flex cursor-pointer items-center gap-1.5 px-4 py-2 font-semibold text-white transition-colors"
        >
          <FaPlus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* Extension chips */}
      <div className="flex flex-wrap gap-2">
        {extensions.map((item) => (
          <div
            key={item.id}
            className="bg-gray rounded-6px text-yellowish-white small-text flex items-center gap-2 px-3 py-1.5"
          >
            <span>{item.pattern}</span>
            <LuTrash2
              className="text-red h-4 w-4 cursor-pointer"
              onClick={() => removeScopeRule(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
