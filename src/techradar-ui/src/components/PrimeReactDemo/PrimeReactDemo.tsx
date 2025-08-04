import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";

interface SampleData {
  id: number;
  name: string;
  category: string;
  date: Date;
  status: string;
}

export const PrimeReactDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const cities = [
    { label: "New York", value: "NY" },
    { label: "Rome", value: "RM" },
    { label: "London", value: "LDN" },
    { label: "Istanbul", value: "IST" },
    { label: "Paris", value: "PRS" },
  ];

  const sampleData: SampleData[] = [
    {
      id: 1,
      name: "Sample Item 1",
      category: "Category A",
      date: new Date(),
      status: "Active",
    },
    {
      id: 2,
      name: "Sample Item 2",
      category: "Category B",
      date: new Date(),
      status: "Inactive",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            PrimeReact + Tailwind CSS Demo
          </h1>
          <p className="text-gray-600">
            This demo showcases PrimeReact components styled with Tailwind CSS utility classes.
          </p>
        </div>

        {/* Form Components */}
        <Card className="shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Form Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Text Input
                </label>
                <InputText
                  id="input-text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter text here..."
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 mb-2">
                  Dropdown
                </label>
                <Dropdown
                  id="dropdown"
                  value={selectedCity}
                  options={cities}
                  onChange={(e) => setSelectedCity(e.value)}
                  placeholder="Select a City"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="calendar" className="block text-sm font-medium text-gray-700 mb-2">
                  Date Picker
                </label>
                <Calendar
                  id="calendar"
                  value={date}
                  onChange={(e) => setDate(e.value || null)}
                  showIcon
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="textarea" className="block text-sm font-medium text-gray-700 mb-2">
                  Textarea
                </label>
                <InputTextarea
                  id="textarea"
                  rows={4}
                  placeholder="Enter description..."
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Checkbox
                    inputId="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.checked || false)}
                  />
                  <label htmlFor="checkbox" className="ml-2 text-sm text-gray-700">
                    Accept terms and conditions
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <RadioButton
                      inputId="option1"
                      name="option"
                      value="Option 1"
                      onChange={(e) => setSelectedOption(e.value)}
                      checked={selectedOption === "Option 1"}
                    />
                    <label htmlFor="option1" className="ml-2 text-sm text-gray-700">
                      Option 1
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioButton
                      inputId="option2"
                      name="option"
                      value="Option 2"
                      onChange={(e) => setSelectedOption(e.value)}
                      checked={selectedOption === "Option 2"}
                    />
                    <label htmlFor="option2" className="ml-2 text-sm text-gray-700">
                      Option 2
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-outlined p-button-secondary"
            />
            <Button
              label="Submit"
              icon="pi pi-check"
              className="p-button-primary"
            />
            <Button
              label="Show Dialog"
              icon="pi pi-external-link"
              onClick={() => setDialogVisible(true)}
              className="p-button-info"
            />
          </div>
        </Card>

        {/* Data Table */}
        <Card className="shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Table</h2>
          <DataTable
            value={sampleData}
            responsiveLayout="scroll"
            className="border border-gray-200 rounded-lg"
          >
            <Column field="id" header="ID" className="font-semibold"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column
              field="date"
              header="Date"
              body={(rowData) => rowData.date.toLocaleDateString()}
            ></Column>
            <Column
              field="status"
              header="Status"
              body={(rowData) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rowData.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {rowData.status}
                </span>
              )}
            ></Column>
          </DataTable>
        </Card>

        {/* Dialog */}
        <Dialog
          header="Sample Dialog"
          visible={dialogVisible}
          style={{ width: "450px" }}
          onHide={() => setDialogVisible(false)}
          className="border-0 shadow-xl"
        >
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              This is a sample dialog demonstrating how PrimeReact dialogs work with Tailwind CSS styling.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                label="Close"
                icon="pi pi-times"
                onClick={() => setDialogVisible(false)}
                className="p-button-text"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                onClick={() => setDialogVisible(false)}
                className="p-button-primary"
              />
            </div>
          </div>
        </Dialog>

        <Toast />
      </div>
    </div>
  );
};
