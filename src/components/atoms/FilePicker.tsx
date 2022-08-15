import React, { useState } from "react";
import { randomString } from "../../utils/random";
import "../../style/style.css";

interface IProps {
  placeholder: string;
  accept?: string;
  hasError?: boolean;
  handleUpload: (file: File) => void;
}

export default function FilePicker({
  placeholder,
  accept,
  hasError = false,
  handleUpload,
}: IProps) {
  const [file, setFile] = useState<File | null>(null);
  const [_placeholder, setPlaceholder] = useState(placeholder);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPlaceholder(file.name);
      handleUpload(file);
    }
  };

  const pickerId = randomString(16);

  return (
    <div>
      <div
        className={`flex outline-none border ${
          hasError ? "border-error-500" : "border-neutral-350"
        } rounded-lg`}
      >
        <span
          className={`py-3 px-4 text-sm w-full truncate ${
            file ? "text-neutral-600" : " text-neutral-700"
          }`}
        >
          {_placeholder}
        </span>
        <label
          htmlFor={pickerId}
          className={`py-3 px-4 w-32 border-l  ${
            hasError ? "border-error-500" : "border-neutral-350"
          } rounded-lg text-sm cursor-pointer`}
        >
          Select File
        </label>
      </div>
      <input
        id={pickerId}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
