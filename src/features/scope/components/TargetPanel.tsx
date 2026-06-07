import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import ScopeItem from "./ScopeItem";
import Header from "./Header";
import Button from "./Button";
import useProxyTraffic from "../../Interceptor/hooks/useProxyTraffic";
import useProxyActions from "../../Interceptor/hooks/useProxyActions";

export default function TargetPanel() {
  const { scope } = useProxyTraffic();
  const { addScopeRule, removeScopeRule, toggleScope } = useProxyActions();
  const [input, setInput] = useState("");

  const isInclude = scope?.include || [];
  const isExclude = scope?.exclude || [];
  const isOn = scope?.enabled || false;

  // handle add button click
  function handleAdd() {
    if (input) {
      addScopeRule("include", input);
      setInput("");
    }
  }

  // handle exclude button click
  function handleExclude() {
    if (input) {
      addScopeRule("exclude", input);
      setInput("");
    }
  }

  // handle delete include button click
  function deleteInclude(id: number) {
    removeScopeRule(id);
  }

  // handle delete exclude button click
  function deleteExclude(id: number) {
    removeScopeRule(id);
  }

  return (
    <div className="flex h-full w-full flex-col gap-y-5">
      {/* header */}
      <Header
        title="Target Scope"
        isOn={isOn}
        onToggle={(enabled) => toggleScope(enabled)}
      />
      {/* description */}
      <div className="relative flex h-full w-full flex-col gap-y-5">
        <p className="normal-text text-yellowish-white">
          Only items matching these rules will be intercepted and logged,
          Wildcards like * are supported, also RegEx is Supported.
        </p>
        {/* input row */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="fawry"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-gray rounded-6px w-1/2 px-4 py-2 outline-0"
          />
          <div className="flex items-center gap-x-5">
            {/* buttons */}
            <Button
              onClick={handleAdd}
              className="border-red text-yellowish-white large-text hover:shadow-light-red/50 shadow-light-red/30 rounded-6px flex cursor-pointer items-center gap-x-1.5 border bg-transparent px-3 py-2 font-bold shadow-[0_0_15px] transition-shadow"
            >
              <FaPlus className="h-5 w-5" />
              Include
            </Button>
            <Button
              onClick={handleExclude}
              className="border-red text-yellowish-white large-text hover:shadow-light-red/50 shadow-light-red/30 rounded-6px flex cursor-pointer items-center gap-x-1.5 border bg-transparent px-3 py-2 font-bold shadow-[0_0_15px] transition-shadow"
            >
              <FaMinus className="h-5 w-5" />
              Exclude
            </Button>
          </div>
        </div>

        {/* scope list */}
        <div className="flex h-full items-center gap-5">
          <div className="bg-gray rounded-6px flex h-full w-full items-center gap-x-5 overflow-auto px-6 py-3">
            <div className="flex h-full w-full flex-col items-center gap-3">
              {/* include list */}
              <p className="mid-text text-yellowish-white">Include</p>
              <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto">
                {isInclude.map((item) => (
                  <ScopeItem
                    key={item.id}
                    scope={item.pattern}
                    deleteScope={() => deleteInclude(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray rounded-6px flex h-full w-full gap-x-5 overflow-auto px-6 py-3">
            {/* exclude list */}
            <div className="flex h-full w-full flex-col items-center gap-3 overflow-auto">
              <p className="mid-text text-yellowish-white">Exclude</p>
              <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto">
                {isExclude.map((item) => (
                  <ScopeItem
                    key={item.id}
                    scope={item.pattern}
                    deleteScope={() => deleteExclude(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute top-0 left-0 transition-all duration-300 ${isOn ? "h-0 w-full" : "h-full w-full bg-black/50"}`}
        ></div>
      </div>
    </div>
  );
}
