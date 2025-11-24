import { useState } from "react";

import { FaMinus, FaPlus } from "react-icons/fa";
import ScopeItem from "./ScopeItem";
import Header from "./Header";
import Button from "./Button";

export default function TargetPanel() {
  const [isInclude, setIsInclude] = useState<string[]>([
    ".*fawry\\.com",
    ".*paypal\\.com",
    ".*stripe\\.com",
    ".*braintree\\.com",
    ".*adyen\\.com",
  ]);
  const [isExclude, setIsExclude] = useState<string[]>([
    ".*google\\.com",
    ".*facebook\\.com",
    ".*amazon\\.com",
    ".*apple\\.com",
  ]);
  const [input, setInput] = useState("");

  // handle add button click
  function handleAdd() {
    if (input) {
      if (isInclude.includes(input)) {
        setInput("");
      } else if (isExclude.includes(input)) {
        setIsExclude(isExclude.filter((item) => item !== input));
        setIsInclude([...isInclude, input]);
      } else {
        setIsInclude([...isInclude, input]);
      }
      setInput("");
    }
  }
  // handle exclude button click
  function handleExclude() {
    if (input) {
      if (isExclude.includes(input)) {
        setInput("");
      } else if (isInclude.includes(input)) {
        setIsInclude(isInclude.filter((item) => item !== input));
        setIsExclude([...isExclude, input]);
      } else {
        setIsExclude([...isExclude, input]);
      }
      setInput("");
    }
  }
  // handle delete include button click
  function deleteInclude(string: string) {
    setIsInclude(isInclude.filter((item) => item !== string));
  }
  // handle delete exclude button click
  function deleteExclude(string: string) {
    setIsExclude(isExclude.filter((item) => item !== string));
  }

  return (
    <div className="flex h-full w-full flex-col gap-y-5 lg:w-1/2">
      {/* header */}
      <Header title="Target Scope" param="isScopeOn" />
      {/* description */}
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
      <div className="bg-gray rounded-6px flex h-full w-full gap-x-5 overflow-auto px-6 py-3">
        <div className="flex h-full w-1/2 flex-col items-center gap-3">
          {/* include list */}
          <p className="mid-text text-yellowish-white">Include</p>
          <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto">
            {isInclude.map((scope) => (
              <ScopeItem
                key={scope}
                scope={scope}
                deleteScope={deleteInclude}
              />
            ))}
          </div>
        </div>
        {/* exclude list */}
        <div className="flex h-full w-1/2 flex-col items-center gap-3 overflow-auto">
          <p className="mid-text text-yellowish-white">Exclude</p>
          <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto">
            {isExclude.map((scope) => (
              <ScopeItem
                key={scope}
                scope={scope}
                deleteScope={deleteExclude}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
