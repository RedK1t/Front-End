import Header from "./Header";
import Button from "./Button";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { LuTrash2 } from "react-icons/lu";

export default function ExclusionPanel() {
  const [input, setInput] = useState("");
  const [rules, setRules] = useState<string[]>([
    "js",
    "css",
    "html",
    "jpg",
    "png",
    "gif",
    "svg",
    "ico",
    "woff",
    "woff2",
    "ttf",
  ]);
  function handleAdd() {
    if (input) {
      if (rules.includes(input)) {
        setInput("");
        return;
      }
      setRules([...rules, input]);
      setInput("");
    }
  }
  function handleDelete(targetRule: string) {
    setRules(rules.filter((rule) => rule !== targetRule));
  }
  return (
    <div className="flex h-full w-full flex-col gap-y-5 lg:w-1/2">
      {/* header */}
      <Header title="Exclude" param="isExcludeOn" />
      {/* description */}
      <p className="normal-text text-yellowish-white">
        Items matching these rules will not be intercepted or logged in the
        history, There are some default extensions that will be excluded by
        default you can edit them if you want.
      </p>
      {/* input row */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="js"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-gray rounded-6px w-full px-4 py-2 outline-0"
        />
        <Button onClick={handleAdd}>
          <FaPlus /> Add
        </Button>
      </div>
      {/* rules list */}
      <div className="bg-gray rounded-6px h-full w-full overflow-auto px-6 py-4">
        <div className="flex max-h-full flex-wrap gap-x-3 gap-y-3.5">
          {rules.map((rule) => (
            <div
              className="rounded-6px text-yellowish-white flex h-fit w-28 items-center justify-between bg-black px-3 py-3"
              key={rule}
            >
              {rule}
              <LuTrash2
                className="text-red h-5 w-5 cursor-pointer"
                onClick={() => handleDelete(rule)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
