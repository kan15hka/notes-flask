import React, { useState } from "react";
import TagInput from "./TagInput";
import { MdClose } from "react-icons/md";
import { axiosInstance } from "../apis/axiosInstance";
import { modalType, toastType } from "../helper/helper";
import { useAuth } from "../context/AuthContext";

export default function Modal({
  showToastMessage,
  onModalClose,
  getNotes,
  type,
  noteData,
}) {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags_list || []);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const addNote = async () => {
    try {
      const accessToken = user["accessToken"];
      const user_id = parseInt(user["id"], 10);
      const tagsString = tags.join(",");
      const newNote = {
        title: title,
        content: content,
        tags: tagsString,
        user_id: user_id,
      };

      console.log(newNote);
      const response = await axiosInstance.post("/add_note", newNote, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response.data.message);
      if (response?.data?.message) {
        getNotes();
        onModalClose();
        showToastMessage({
          message: response.data.message,
          type: toastType.SUCCESS,
        });
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data) {
        console.log(error);
      }
      showToastMessage({
        message: "Error in adding Note.",
        type: toastType.ERROR,
      });
    }
  };

  const editNote = async (noteData) => {
    try {
      const accessToken = user["accessToken"];
      const user_id = parseInt(user["id"], 10);
      const note_id = noteData["id"];
      const tagsString = tags.join(",");

      const newNote = {
        title: title,
        content: content,
        tags: tagsString,
        user_id: user_id,
      };
      const response = await axiosInstance.put(
        `/update_note/${note_id}`,
        newNote,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response.data.message);
      if (response?.data?.message) {
        getNotes();
        onModalClose();
        showToastMessage({
          message: response.data.message,
          type: toastType.SUCCESS,
        });
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data) {
        console.log(error);
      }
      showToastMessage({
        message: "Error in editing Note.",
        type: toastType.ERROR,
      });
    }
  };

  const addeditNote = (type) => {
    if (title.trim() === "") {
      setError("Title field cannot be empty.");
      return;
    }
    if (content.trim() === "") {
      setError("Content field cannot be empty.");
      return;
    }
    if (tags.length === 0) {
      setError("Tags field cannot be empty.");
      return;
    }
    setError(null);

    if (type == modalType.ADD) {
      addNote();
    } else {
      editNote(noteData);
    }
  };

  return (
    <div className="w-1/2 absolute p-4 rounded-lg border-2 border-black bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="my-2 flex items-center justify-between">
        <p className="text-lg font-semibold">
          {type == modalType.ADD ? "ADD NOTE" : "EDIT NOTE"}
        </p>
        <button onClick={onModalClose}>
          <MdClose size={25} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <label className="input-label text-xs"> TITLE</label>
        <input
          type="text"
          className="text-base text-slate-950 outline-none"
          placeholder="Go to Gym at 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-xs">CONTENT</label>
        <textarea
          type="text"
          className=" text-base text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={5}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>
      <div className="mt-3">
        <label className="text-xs">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button
        onClick={() => {
          addeditNote(type);
        }}
        className=" mt-4 p-2 w-full text-white bg-black rounded-md font-semibold"
      >
        {type == modalType.ADD ? "ADD NOTE" : "EDIT NOTE"}
      </button>
    </div>
  );
}
