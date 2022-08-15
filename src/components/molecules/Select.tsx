import React, { useEffect, useMemo, useRef, useState } from "react";
import { SelectData, SelectProps } from "../../types/props";
import { randomString } from "../../utils/random";
import Icon from "../atoms/Icon";
import "../../style/style.css";

export default function Select({
  handleChange,
  name,
  placeholder,
  options,
  className = "",
  disabled = false,
  required = true,
  loading = false,
  value = "",
  hasError = false,
  width = "80",
}: SelectProps) {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  const [searchQuery, setsearchQuery] = useState("");
  const [filtered, setfiltered] = useState<SelectData[]>([]);

  const [_placeholder, set_placeholder] = useState(
    placeholder || `Select ${name.replaceAll("_", " ").toLocaleLowerCase()}`
  );

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const opts = options.filter((opt) => opt.value.toString().length > 0);
    setfiltered([...opts] || []);
  }, [options]);

  //if value prop changes, update internalValue
  useEffect(() => {
    if (value !== internalValue) setInternalValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // when internal value changes, call handleChange
  useEffect(() => {
    handleChange({ name, value: internalValue });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue]);

  useEffect(() => {
    if (internalValue.length > 0) {
      set_placeholder(
        options.find((op) => op.value == internalValue)?.label ||
          placeholder ||
          ""
      );
    }
  }, [internalValue, options, placeholder]);

  const handleSelect = (value: string) => {
    setsearchQuery("");
    setInternalValue(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchQuery(e.target.value);
    setfiltered(
      options.filter((op) =>
        op.label
          .toLocaleLowerCase()
          .includes(e.target.value.toLocaleLowerCase())
      )
    );
  };

  // const handleArrowClick = () => {
  //   if (document.activeElement === input.current) {
  //     input.current?.blur();
  //   } else {
  //     input.current?.focus();
  //   }
  // };

  let selectId = useMemo(() => randomString(16), []);
  return (
    <div className={`w-${width || "full"} ${className}`}>
      <div>
        <div className="relative hover:border-primary-400">
          {/* hidden input */}
          <input
            type="text"
            name={name}
            value={internalValue}
            required={required}
            onChange={(_e) => {}}
            onFocus={() => input.current?.focus()}
            className="border-none focus:outline-none absolute w-full top-0 text-white h-0 placeholder-black"
            style={{ zIndex: -10 }}
          />
          {/* input with placeholder */}
          <input
            disabled={disabled}
            ref={input}
            value={searchQuery}
            onFocus={() => setisMenuOpen(true)}
            placeholder={_placeholder}
            onChange={handleSearch}
            id={selectId}
            onBlur={() => setisMenuOpen(false)}
            className={`block w-full hover:border-primary-400 placeholder-${
              internalValue ? "black" : "txt-secondary"
            } h-10 text-sm border border-${
              hasError ? "error-500" : "tertiary"
            }  rounded-md px-2 focus:border-primary-500 focus:outline-none font-normal cursor-pointer`}
          />
          {/* 
            // type="button"
            // onMouseDown={handleArrowClick}
            // className="inline absolute top-0 right-0 cursor-pointer"> */}
          <label
            htmlFor={selectId}
            className="inline absolute top-2 right-1 cursor-pointer"
          >
            <Icon name={"chevron-down"} size={24} />
          </label>
        </div>
        {/* Dropdown menu */}
        <div
          className={`${
            isMenuOpen ? "relative" : "hidden"
          } w-full p-0 m-0 pt-2 bg-white z-10`}
        >
          <div
            className="py-1 origin-top max-h-60 overflow-y-auto overflow-x-hidden absolute w-full rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none p-0 m-0"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="static">
              {filtered.map((op) => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  key={op.value}
                  onMouseDown={() => handleSelect(op.value.toString())}
                  className={`py-2 cursor-pointer ${
                    internalValue == op.value
                      ? "bg-primary-500 text-white"
                      : "bg-main text-black hover:bg-blue-100"
                  } rounded-none text-left px-4 text-sm capitalize`}
                >
                  {op.label}
                </div>
              ))}

              {filtered.length === 0 && (
                <p className="py-2 text-left px-4 text-sm text-gray-500">
                  {loading ? "loading..." : "No options available"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
