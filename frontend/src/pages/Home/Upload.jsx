import { useState } from "react";
import TagInput from "../../components/Input/TagInput ";
import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const UploadPdf = (props) => {
  const { onClose = () => {}, getAllNotes } = props;
  const [tags, setTags] = useState([]);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const refactorData = {
      "pdf-file": data.pdf[0] || {},
      title: data?.title || "",
      content: "",
      tags: tags || [],
    };

    const res = await axios.post(
      "http://localhost:3000/api/note/add",
      refactorData,
      {
        headers: { "content-type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    onClose();
    toast.success("Note Added SuccessFully...");
    getAllNotes();
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="flex flex-col gap-2">
          <label className="input-label text-red-400 uppercase">Title</label>

          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="Enter Your Title"
            {...register("title")}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label text-red-400 uppercase">
            Upload Pdf
          </label>

          <input
            className="btn-primary font-medium mt-5 p-3"
            type="file"
            name="pdf"
            accept="application/pdf"
            {...register("pdf")}
          />
        </div>

        <div className="mt-3">
          <label className="input-label text-red-400 uppercase">tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {/* {error && <p className="text-red-500 text-xs pt-4">{error}</p>} */}

        <button className="btn-primary font-medium mt-5 p-3" type="submit">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadPdf;
