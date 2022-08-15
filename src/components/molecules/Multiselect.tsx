import React, { useEffect, useMemo, useRef, useState } from "react";
import { MultiselectProps, SelectData } from "../../types/props";
import { arrayEquals } from "../../utils/array";
import { randomString } from "../../utils/random";
import Icon from "../atoms/Icon";

import "../../style/style.css";

export default function Multiselect({
  handleChange,
  name,
  placeholder,
  options,
  className = "",
  disabled = false,
  required = true,
  loading = false,
  value = [],
  hasError = false,
  width = "80",
}: MultiselectProps) {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string[]>([]);

  const [searchQuery, setsearchQuery] = useState("");
  const [filtered, setfiltered] = useState<SelectData[]>(options);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setfiltered([...options] || []);
  }, [options]);

  //if value prop changes, update internalValue
  useEffect(() => {
    if (!arrayEquals(value, internalValue)) setInternalValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // when internal value changes, call handleChange
  useEffect(() => {
    handleChange({ name, value: internalValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue]);

  const handleSelect = (value: string) => {
    if (internalValue.includes(value)) {
      setInternalValue(internalValue.filter((val) => val != value));
    } else {
      setInternalValue([...internalValue, value]);
    }
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

  let selectId = useMemo(() => randomString(16), []);

  return (
    <div className={`w-${width || "full"} ${className}`}>
      <div>
        <div className="relative hover:border-primary-400">
          {/* hidden input */}
          <input
            type="text"
            name={name}
            value={internalValue.join()}
            required={required}
            onChange={(_e) => {}}
            onFocus={() => input.current?.focus()}
            className="border-none focus:outline-none absolute w-full top-0 text-white h-0 placeholder-black"
            style={{ zIndex: -10 }}
          />
          <div
            className={`border border-${
              hasError ? "error-500" : "tertiary"
            } bg-white rounded-md px-2 hover:border-primary-400`}
          >
            <div
              className={`flex flex-wrap w-full gap-1 ${
                internalValue.length > 0 ? "pt-1" : ""
              }`}
            >
              {internalValue.map(
                (val) =>
                  val.length > 0 && (
                    <div
                      key={val}
                      className="inline p-2 text-sm bg-gray-200 rounded"
                    >
                      {options.find((op) => op.value == val)?.label || val}
                    </div>
                  )
              )}
            </div>

            {/* filter options input with placeholder */}

            <input
              disabled={disabled}
              ref={input}
              value={searchQuery}
              onFocus={() => setisMenuOpen(true)}
              placeholder={placeholder || `Select ${name.replaceAll("_", "")}`}
              onChange={handleSearch}
              id={selectId}
              onBlur={() => setisMenuOpen(false)}
              className={`block w-full placeholder-txt-secondary h-10 text-sm  focus:outline-none font-normal cursor-pointer`}
            />
          </div>

          <label
            htmlFor={selectId}
            className="inline absolute top-2 right-1 cursor-pointer my-auto"
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
                    internalValue.includes(op.value.toString())
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
