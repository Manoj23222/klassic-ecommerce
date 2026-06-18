"use client";

type Rule = {
  _id?: string;
  fieldName: string;
  fieldKey: string;
  fieldType: string;
  options?: string[];
  placeholder?: string;
  unit?: string;
  required?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  showOnProductPage?: boolean;
};

export default function DynamicAttributeForm({
  rules,
  values,
  setValues,
}: {
  rules: Rule[];
  values: Record<string, any>;
  setValues: (values: Record<string, any>) => void;
}) {
  function updateValue(key: string, value: any) {
    setValues({
      ...values,
      [key]: value,
    });
  }

  if (!rules || rules.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-gray-50 p-5 text-sm font-semibold text-gray-500">
        Select leaf category to load dynamic product attributes.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rules.map((rule) => (
        <label key={rule._id || rule.fieldKey} className="block">
          <span className="mb-1 block text-sm font-bold text-gray-700">
            {rule.fieldName}
            {rule.required ? <b className="text-red-500"> *</b> : null}
          </span>

          {rule.fieldType === "dropdown" || rule.fieldType === "radio" ? (
            <select
              value={values[rule.fieldKey] || ""}
              onChange={(e) => updateValue(rule.fieldKey, e.target.value)}
              className="w-full rounded-2xl border bg-white p-3 outline-none focus:border-blue-500"
            >
              <option value="">Select {rule.fieldName}</option>
              {(rule.options || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : rule.fieldType === "textarea" ? (
            <textarea
              rows={3}
              value={values[rule.fieldKey] || ""}
              placeholder={rule.placeholder || ""}
              onChange={(e) => updateValue(rule.fieldKey, e.target.value)}
              className="w-full rounded-2xl border bg-white p-3 outline-none focus:border-blue-500"
            />
          ) : rule.fieldType === "checkbox" ? (
            <button
              type="button"
              onClick={() =>
                updateValue(rule.fieldKey, !Boolean(values[rule.fieldKey]))
              }
              className={`w-full rounded-2xl border p-3 text-left font-bold ${
                values[rule.fieldKey]
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 bg-gray-50 text-gray-500"
              }`}
            >
              {values[rule.fieldKey] ? "Yes" : "No"}
            </button>
          ) : (
            <div className="flex overflow-hidden rounded-2xl border bg-white focus-within:border-blue-500">
              <input
                type={
                  rule.fieldType === "number"
                    ? "number"
                    : rule.fieldType === "date"
                    ? "date"
                    : rule.fieldType === "color"
                    ? "color"
                    : "text"
                }
                value={values[rule.fieldKey] || ""}
                placeholder={rule.placeholder || ""}
                onChange={(e) => updateValue(rule.fieldKey, e.target.value)}
                className="w-full p-3 outline-none"
              />

              {rule.unit ? (
                <span className="flex items-center bg-gray-100 px-3 text-sm font-bold text-gray-500">
                  {rule.unit}
                </span>
              ) : null}
            </div>
          )}

          <span className="mt-1 block text-[11px] font-semibold text-gray-400">
            {rule.filterable ? "Filterable • " : ""}
            {rule.searchable ? "Searchable • " : ""}
            {rule.showOnProductPage ? "Product Page" : ""}
          </span>
        </label>
      ))}
    </div>
  );
}