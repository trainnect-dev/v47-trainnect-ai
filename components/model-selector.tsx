"use client";

import { useState, useRef, useEffect } from "react";
import cn from "classnames";
import { models } from "@/lib/models";
import { ChevronDownIcon } from "./icons";

interface ModelSelectorProps {
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
}

export function ModelSelector({
  selectedModelId,
  setSelectedModelId,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedModel = models.find((model) => model.id === selectedModelId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-0.5 dark:hover:bg-zinc-700 hover:bg-zinc-200 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div>
          {selectedModel ? selectedModel.name : "Models Unavailable!"}
        </div>
        <div className="text-zinc-500">
          <ChevronDownIcon />
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-64 max-h-80 overflow-y-auto bg-white dark:bg-zinc-800 rounded-lg shadow-lg z-10">
          <ul
            className="py-1"
            role="listbox"
            aria-labelledby="model-selector"
          >
            {models.map((model) => (
              <li
                key={model.id}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700",
                  {
                    "bg-zinc-100 dark:bg-zinc-700": model.id === selectedModelId,
                  }
                )}
                role="option"
                aria-selected={model.id === selectedModelId}
                onClick={() => {
                  setSelectedModelId(model.id);
                  setIsOpen(false);
                }}
              >
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {model.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
