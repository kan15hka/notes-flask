import React, { useState } from "react";
import { MdClose } from "react-icons/md";
export default function TagInput({ tags, setTags }) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(
      tags.filter((tag) => {
        tag != tagToRemove;
      })
    );
  };
  return (
    <div className="flex-col gap-2 ">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="GYM"
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
          }}
          onKeyDown={(target) => {
            if (target.key == "Enter") {
              addTag();
            }
          }}
        />
        <button
          onClick={addTag}
          className="bg-black p-2 rounded-lg text-white text-sm"
        >
          Add
        </button>
      </div>
      <div className="inline-flex gap-1">
        {tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded"
              >
                {`#${tag.toUpperCase()}`}
                <button
                  onClick={() => {
                    handleRemoveTag(tag);
                  }}
                >
                  <MdClose />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
