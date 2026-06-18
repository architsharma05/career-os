export function optionalString(value: FormDataEntryValue | null) {
  const stringValue = typeof value === "string" ? value.trim() : "";
  return stringValue.length > 0 ? stringValue : null;
}

export function requiredString(formData: FormData, key: string) {
  const value = optionalString(formData.get(key));
  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

export function optionalNumber(value: FormDataEntryValue | null) {
  const stringValue = optionalString(value);
  if (!stringValue) {
    return null;
  }

  const numberValue = Number(stringValue);
  return Number.isFinite(numberValue) ? numberValue : null;
}

export function optionalDate(value: FormDataEntryValue | null) {
  const stringValue = optionalString(value);
  return stringValue ? new Date(`${stringValue}T12:00:00`) : null;
}

export function commaList(value: FormDataEntryValue | null) {
  const stringValue = optionalString(value);
  if (!stringValue) {
    return [];
  }

  return stringValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function checkboxValue(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}
