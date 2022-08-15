import React from "react";
import { IData } from "../../types/props";
import Icon from "../atoms/Icon";

import "../../style/style.css";

interface ITableProps {
  data: IData[];
  showHeader?: boolean;
  startingRow?: number;
  bottomData?: IData[];
}

function fourDigitNumber(num: number) {
  return String(num).padStart(4, "0");
}

export default function Table({
  data,
  showHeader = true,
  startingRow = 0,
  bottomData,
}: ITableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-5">
        <thead>
          <tr className="border-collapse">
            <th
              scope="col"
              className={
                "border-b border-r border-gray-300 bg-secondary-100 relative p-0 text-sm"
              }
            >
              <div className="absolute bottom-0 right-0 p-1">
                <Icon name="triangle" size={30} />
              </div>
            </th>
            {Object.values(data[0]).map((key, index) => (
              <th
                key={index}
                scope="col"
                className={`border-b border-r border-gray-300 bg-secondary-100 p-2 text-base text-secondary-300`}
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, index) => (
            <tr key={index}>
              <td
                className={`border-b border-r border-gray-300 bg-secondary-100 p-2 text-base text-secondary-300 font-bold`}
              >
                {fourDigitNumber(index + 1)}
              </td>
              {Object.values(row).map((value, index) => (
                <td
                  scope="col"
                  className="border-b border-x border-secondary-200 text-right text-sm font-semibold px-4"
                  key={index}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
          {bottomData && (
            <tr>
              <td colSpan={Object.values(data[0]).length + 1}>
                <p className="pt-1 pb-5 text-4xl text-center w-2/3"> ...</p>
              </td>
            </tr>
          )}

          {bottomData?.slice(1).map((row, index) => (
            <tr
              key={index}
              className="border-collapse border-t border-secondary-200"
            >
              <td
                className={`border-b border-r border-gray-300 bg-secondary-100 p-2 text-base text-secondary-300 font-bold`}
              >
                {fourDigitNumber(index + startingRow + 1)}
              </td>
              {Object.values(row).map((value, index) => (
                <td
                  scope="col"
                  className="border-b border-x border-secondary-200 text-right text-sm font-semibold px-8 py-2"
                  key={index}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
