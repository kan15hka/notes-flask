import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { axiosInstance } from "../../apis/axiosInstance";
import NoteCard from "../../components/NoteCard";
import { FaPlus } from "react-icons/fa";
import Toast from "../../components/Toast";
import { displayMsgType, modalType, toastType } from "../../helper/helper";
import Modal from "../../components/Modal";
import DisplayMsg from "../../components/DisplayMsg";
import { useAuth } from "../../context/AuthContext";
export default function Home() {
  const [notes, setNotes] = useState([]);
  // const [searchedNotes, setSearchedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState({
    isShown: false,
    message: "",
    type: toastType.SUCCESS,
  });

  const { user } = useAuth();
  const [showModal, setShowModal] = useState({
    isShown: false,
    type: modalType.ADD,
    noteData: null,
  });
  const getNotes = async () => {
    if (!user || !user.accessToken) {
      setError("User Not found");
      return;
    }
    try {
      const accessToken = user["accessToken"];
      const user_id = parseInt(user["id"], 10);
      const response = await axiosInstance.get(`/notes/${user_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response.data);
      setNotes(response.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getNotes();
  }, [user]);

  const showToastMessage = ({ message, type }) => {
    setShowToast({
      isShown: true,
      message: message,
      type: type,
    });
  };

  const onToastClose = () => {
    setShowToast({ isShown: false, message: "", type: toastType.NULL });
  };

  const onModalClose = () => {
    setShowModal({ isShown: false, type: modalType.ADD, noteData: null });
  };

  const onModalOpen = ({ type, noteData }) => {
    setShowModal({ isShown: true, type: type, noteData: noteData });
  };

  const onEditNote = (note) => {
    onModalOpen({ type: modalType.EDIT, noteData: note });
  };

  const onDeleteNote = async (note) => {
    try {
      const note_id = note["id"];
      const accessToken = user["accessToken"];
      const response = await axiosInstance.delete(`/delete_note/${note_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response?.data?.message) {
        getNotes();
        showToastMessage({
          message: response.data.message,
          type: toastType.SUCCESS,
        });
      }
    } catch (error) {
      // console.log(error);
      if (error?.response?.data) {
        console.log(error.response.data.message);
      }
      showToastMessage({
        message: "Error in deleting Note.",
        type: toastType.ERROR,
      });
    }
  };

  if (loading)
    return (
      <div>
        <Navbar setShowToast={setShowToast} />
        <DisplayMsg
          type={displayMsgType.POSITIVE}
          message="Hang tight, your notes are on their way!"
        />
      </div>
    );
  if (error != null)
    return (
      <div>
        <Navbar />
        <DisplayMsg
          type={displayMsgType.NEGATIVE}
          message="Network error! Please check your connection and try again"
        />
      </div>
    );

  return (
    <div>
      <Navbar setShowToast={setShowToast} />
      <div className="w-full p-5">
        <div>
          {notes.length == 0 && (
            <DisplayMsg
              type={displayMsgType.POSITIVE}
              message="Looks like you don't have any notes yet! Start by adding one."
            />
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 ">
          {notes.map((note, index) => {
            return (
              <div key={index}>
                <NoteCard
                  date={note.created_date}
                  time={note.created_time}
                  title={note.title}
                  content={note.content}
                  tags={note.tags_list}
                  onEditNote={() => {
                    onEditNote(note);
                  }}
                  onDeleteNote={() => {
                    onDeleteNote(note);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => {
          onModalOpen({ type: modalType.ADD, noteData: null });
        }}
        className=" fixed bg-white right-10 bottom-10 h-10 w-10 border-2 border-black rounded-lg flex items-center justify-center "
      >
        <p className="text-2xl text-black">+</p>
      </button>
      {showModal.isShown && (
        <Modal
          showToastMessage={showToastMessage}
          onModalClose={onModalClose}
          getNotes={getNotes}
          type={showModal.type}
          noteData={showModal.noteData}
        />
      )}
      <Toast
        isShown={showToast.isShown}
        message={showToast.message}
        type={showToast.type}
        onClose={onToastClose}
      />
    </div>
  );
}
