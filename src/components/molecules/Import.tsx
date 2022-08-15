import React, { FormEvent, useState } from "react";
import { IconNames, IData, ValueType } from "../../types/props";
import FilePicker from "../atoms/FilePicker";
import Icon from "../atoms/Icon";
import Papa from "papaparse";
import Table from "./Table";
import { ISubmitInfo } from "../../types";
import Select from "./Select";
import _ from "lodash";
import {
  calculateUnixTimestampGivenFrequency,
  getUnixTimestampByElapsedTime,
} from "../../utils/functions";

import "../../style/style.css";

interface IExtractedData {
  first40: IData[];
  last10: IData[];
  all: IData[];
}

export default function Import() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File>();
  const [hasError, sethasError] = useState(false);
  const [useFrequency, setUseFrequency] = useState(false);

  const [extractedData, setExtractedData] = useState<IExtractedData>({
    first40: [],
    last10: [],
    all: [],
  });

  const steps: IconNames[] = ["upload", "process", "table"];
  const [values, setValues] = useState({
    starttime: "",
    frequency: 1,
    pressure: "",
    slurry: "",
    elapsedTime: "",
    unitOfSlurry: "bpm",
    unitOfPressure: "psi",
    propConc: "",
    unitOfPropConc: "ppg",
    separator: ",",
    numHeaderRows: 2,
    time_shift: 0,
  });

  const handleChange = (e: ValueType) => {
    setValues({ ...values, [e.name]: e.value });
  };

  const handleParse = () => {
    sethasError(false);

    if (!file) return;
    try {
      Papa.parse<any>(file, {
        header: false,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: function (results) {
          try {
            setExtractedData({
              first40: results.data.slice(0, 40),
              last10: results.data.slice(-10),
              all: results.data,
            });

            setStep(1);
          } catch (error) {
            sethasError(true);
          }
        },
        error: function (err) {
          sethasError(true);
        },
      });
    } catch (error) {
      sethasError(true);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    //remove header rows
    const data = extractedData.all.slice(Math.abs(values.numHeaderRows));

    const pressureData = data.map((x) => Number(x[parseInt(values.pressure)]));
    const slurryData = data.map((x) => Number(x[parseInt(values.slurry)]));
    const propConcData = data.map((x) => Number(x[parseInt(values.propConc)]));

    const _data: ISubmitInfo = {
      stage: 1,
      well: 1,
      offset_min: 1,
      time_shift: values.time_shift,
      time: useFrequency
        ? calculateUnixTimestampGivenFrequency(
            values.starttime,
            values.time_shift,
            values.frequency,
            data
          )
        : getUnixTimestampByElapsedTime(
            values.starttime,
            values.time_shift,
            parseInt(values.elapsedTime),
            data
          ),

      slurry: {
        data: slurryData,
        unit: values.unitOfSlurry,
      },
      pressure: {
        data: pressureData,
        unit: values.unitOfPressure,
      },
      prop: {
        data: propConcData,
        unit: values.unitOfPropConc,
      },
    };

    console.log(_data);
  };

  const isMissingData =
    !values.pressure ||
    !values.slurry ||
    !values.propConc ||
    !values.unitOfPressure ||
    !values.unitOfSlurry ||
    !values.unitOfPropConc ||
    !values.separator ||
    !values.numHeaderRows;

  return (
    <div>
      <div className="flex items-center justify-between gap-6 pb-6 border-b">
        {steps.map((icon, index) => (
          <Icon
            key={index}
            name={icon}
            size={30}
            className={`${
              index === step ? "text-primary-500" : "text-neutral-500"
            }`}
          />
        ))}
      </div>
      {step === 0 ? (
        <div className="import-file">
          <p className="text-base pb-2">Import CSV file</p>
          <div className="w-full">
            <FilePicker
              placeholder={"No file selected"}
              hasError={hasError}
              handleUpload={(file) => setFile(file)}
              //  handleUpload={handleParse}
              accept=".csv"
            />
          </div>
          <div className="pt-6">
            <button
              className={`${
                !file ? "bg-neutral-400" : "bg-primary-500"
              } text-white font-bold py-3 px-6 rounded-lg`}
              disabled={!file}
              onClick={handleParse}
            >
              Process data
            </button>
          </div>
        </div>
      ) : step === 1 ? (
        <div className="choose-options">
          <div className="py-10  md:w-10/12 lg:w-2/3">
            <h2 className="text-xl font-bold">Define input data</h2>
            {/* trick JIT engine */}
            <div className="w-20 hidden" />
            <div className="grid grid-cols-2 gap-6 py-5">
              <div className="left-selects">
                <div className="py-2">
                  <label>pressure</label>
                  <div className="py-2 flex gap-1">
                    <Select
                      name="pressure"
                      value={values.pressure}
                      handleChange={handleChange}
                      options={Object.values(extractedData.first40[0]).map(
                        (key, index) => ({
                          label: `${key} - (col ${index + 1})`,
                          value: index,
                        })
                      )}
                    />

                    <Select
                      name="unitOfPressure"
                      handleChange={handleChange}
                      value={values.unitOfPressure}
                      width={"20"}
                      options={[
                        { label: "pa", value: "pascal" },
                        { label: "psi", value: "psi" },
                      ]}
                    />
                  </div>
                </div>
                <div className="py-2">
                  <label>Slurry rate</label>
                  <div className="py-2 flex gap-1">
                    <Select
                      name="slurry"
                      value={values.slurry}
                      handleChange={handleChange}
                      options={Object.values(extractedData.first40[0]).map(
                        (key, index) => ({
                          label: `${key} - (col ${index + 1})`,
                          value: index,
                        })
                      )}
                    />

                    <Select
                      name="unitOfSlurry"
                      handleChange={handleChange}
                      value={values.unitOfSlurry}
                      width={"20"}
                      options={[
                        { label: "bpm", value: "bpm" },
                        { label: "m3/s", value: "m3/s" },
                      ]}
                    />
                  </div>
                </div>
                <div className="py-2">
                  <label>Pronc conc</label>
                  <div className="py-2 flex gap-1">
                    <Select
                      name="propConc"
                      value={values.propConc}
                      handleChange={handleChange}
                      options={Object.values(extractedData.first40[0]).map(
                        (key, index) => ({
                          label: `${key} - (col ${index + 1})`,
                          value: index,
                        })
                      )}
                    />

                    <Select
                      name="unitOfPropConc"
                      handleChange={handleChange}
                      value={values.unitOfPropConc}
                      width={"20"}
                      options={[
                        { label: "ppg", value: "ppg" },
                        { label: "kg/m3", value: "kg/m3" },
                      ]}
                    />
                  </div>
                </div>
                <div className="py-2">
                  <label>Decimal separator</label>
                  <div className="py-2 w-2/3">
                    <Select
                      name="separator"
                      handleChange={handleChange}
                      value={values.separator}
                      options={[
                        { label: "dot", value: "." },
                        { label: "comma", value: "," },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div className="right-selects w-2/3">
                <div className="py-2">
                  <label>Start time</label>
                  <input
                    className="w-full block py-2 px-3 rounded-md text-sm border border-gray-500"
                    type="datetime-local"
                    name="starttime"
                    value={values.starttime}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        starttime: e.target.value,
                      })
                    }
                  />
                </div>

                {!useFrequency ? (
                  <div className="pt-2 ">
                    <label>Elapsed time</label>
                    <div className="py-2">
                      <Select
                        name="elapsedTime"
                        handleChange={handleChange}
                        value={values.elapsedTime}
                        options={Object.values(extractedData.first40[0]).map(
                          (key, index) => ({
                            label: `${key} - (col ${index + 1})`,
                            value: index,
                          })
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <label>Frequency</label>
                    <input
                      className="w-full block py-2 px-3 rounded-md text-sm border border-gray-500"
                      type="number"
                      name="frequency"
                      value={values.frequency}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          frequency: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                )}
                <div className="-mt-1 text-right">
                  <button
                    className="text-blue-400 text-sm py-2 px-4"
                    onClick={() => setUseFrequency(!useFrequency)}
                    type="button"
                  >
                    {useFrequency ? "Use elapsed time" : "Use frequency"}
                  </button>
                </div>
                <div className="py-2">
                  <label>Time shift</label>
                  <input
                    className="w-full block py-2 px-3 rounded-md text-sm border border-gray-500"
                    type="number"
                    name="time_shift"
                    value={values.time_shift}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        time_shift: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="py-2">
                  <label>Number of header rows</label>
                  <input
                    className="w-full block py-2 px-3 rounded-md text-sm border border-gray-500"
                    type="number"
                    name="numHeaderRows"
                    value={values.numHeaderRows}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        numHeaderRows: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="table-data py-2">
            <h2 className="text-xl font-bold">Preview</h2>
            <Table
              data={extractedData.first40}
              bottomData={extractedData.last10}
              startingRow={extractedData.all.length}
            />
          </div>
          <div className="py-12">
            <button
              className={`${
                isMissingData ? "bg-neutral-400" : "bg-primary-500"
              } text-white font-medium py-3 px-6 rounded-lg`}
              disabled={isMissingData}
              type="submit"
              onClick={handleSubmit}
            >
              Upload to server
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
