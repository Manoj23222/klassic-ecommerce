"use client";

type AttributeField = {
  name: string;
  label: string;
  type: "text" | "number" | "dropdown" | "checkbox" | "textarea";
  options?: string[];
  unit?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
};

export default function DynamicAttributeForm({
  fields,
  values,
  setValues,
}: {
  fields: AttributeField[];
  values: Record<string, any>;
  setValues: (values: Record<string, any>) => void;
}) {
  function updateValue(name: string, value: any) {
    setValues({
      ...values,
      [name]: value,
    });
  }

  if (!fields || fields.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-gray-50 p-5 text-sm font-semibold text-gray-500">
        Select leaf category to load category specific fields.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="mb-1 block text-sm font-bold text-gray-700">
            {field.label}
            {field.required ? <b className="text-red-500"> *</b> : null}
          </span>

          {field.type === "dropdown" ? (
            <select
              value={values[field.name] || ""}
              onChange={(e) => updateValue(field.name, e.target.value)}
              className="w-full rounded-2xl border bg-white p-3 outline-none focus:border-blue-500"
            >
              <option value="">Select {field.label}</option>
              {(field.options || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              value={values[field.name] || ""}
              placeholder={field.placeholder || ""}
              onChange={(e) => updateValue(field.name, e.target.value)}
              rows={3}
              className="w-full rounded-2xl border bg-white p-3 outline-none focus:border-blue-500"
            />
          ) : field.type === "checkbox" ? (
            <button
              type="button"
              onClick={() => updateValue(field.name, !values[field.name])}
              className={`w-full rounded-2xl border p-3 text-left font-bold ${
                values[field.name]
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 bg-gray-50 text-gray-500"
              }`}
            >
              {values[field.name] ? "Yes" : "No"}
            </button>
          ) : (
            <div className="flex overflow-hidden rounded-2xl border bg-white focus-within:border-blue-500">
              <input
                type={field.type === "number" ? "number" : "text"}
                value={values[field.name] || ""}
                placeholder={field.placeholder || ""}
                onChange={(e) => updateValue(field.name, e.target.value)}
                className="w-full p-3 outline-none"
              />
              {field.unit ? (
                <span className="flex items-center bg-gray-100 px-3 text-sm font-bold text-gray-500">
                  {field.unit}
                </span>
              ) : null}
            </div>
          )}

          {field.helperText ? (
            <span className="mt-1 block text-xs text-gray-500">
              {field.helperText}
            </span>
          ) : null}
        </label>
      ))}
    </div>
  );
}