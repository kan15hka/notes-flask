import React from "react";
import { MdEdit, MdOutlineDelete } from "react-icons/md";

export default function NoteCard({
  date,
  time,
  title,
  content,
  tags,
  onEditNote,
  onDeleteNote,
}) {
  return (
    <div className="border-2 rounded-md border-black p-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col md:flex-row md:gap-2 md:items-center">
          <p className="text-xs text-slate-600">{date}</p>
          <p className="text-xs text-slate-600">{time}</p>
        </div>
        <div className="flex gap-1 items-center">
          <button onClick={onEditNote}>
            <MdEdit size={17.5} className="hover:text-slate-500 text-black " />
          </button>
          <button onClick={onDeleteNote}>
            <MdOutlineDelete
              size={17.5}
              className="hover:text-slate-500 text-black"
            />
          </button>
        </div>
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{content}</p>
      <div className="inline-flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          // <div className="border-2 border-slate-500 font-semibold text-slate-500 text-xs p-1 rounded-md">
          <div
            key={index}
            className="bg-slate-200 text-xs p-1 rounded-sm"
          >{`#${tag.toUpperCase()}`}</div>
        ))}
      </div>
    </div>
  );
}
