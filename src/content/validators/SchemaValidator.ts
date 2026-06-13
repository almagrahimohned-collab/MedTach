// ============================================
// Runtime Schema Validator
// ============================================

export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'string[]' | 'record';

export interface FieldSchema {
  type: FieldType;
  required: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: string[];
  children?: Record<string, FieldSchema>;
  itemSchema?: FieldSchema;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
}

// ============================================
// Case JSON Schema
// ============================================
export const CASE_SCHEMA: Record<string, FieldSchema> = {
  id: { type: 'string', required: true, minLength: 3, maxLength: 100 },
  specialty: { 
    type: 'string', 
    required: true, 
    enum: ['cardiology', 'pulmonology', 'neurology', 'endocrinology', 
           'gastroenterology', 'nephrology', 'hematology', 'infectious',
           'dermatology', 'gynecology', 'pediatrics', 'surgery',
           'rheumatology', 'psychiatry']
  },
  difficulty: { type: 'string', required: true, enum: ['beginner', 'intermediate', 'advanced'] },
  title: { type: 'string', required: true, minLength: 5, maxLength: 200 },
  department: { type: 'string', required: false },
  
  patient: {
    type: 'object',
    required: true,
    children: {
      age: { type: 'number', required: true, min: 0, max: 120 },
      gender: { type: 'string', required: true, enum: ['male', 'female', 'M', 'F'] },
      name: { type: 'string', required: false },
      persona: { type: 'string', required: false }
    }
  },
  
  chief_complaint: { type: 'string', required: true, minLength: 10 },
  
  vitals: {
    type: 'object',
    required: false,
    children: {
      BP: { type: 'string', required: false },
      HR: { type: 'number', required: false, min: 20, max: 250 },
      RR: { type: 'number', required: false, min: 4, max: 60 },
      SpO2: { type: 'number', required: false, min: 0, max: 100 },
      Temp: { type: 'number', required: false, min: 30, max: 45 }
    }
  },
  
  correct_diagnosis: { type: 'string', required: true, minLength: 3 },
  differential_diagnoses: { type: 'string[]', required: true, minLength: 2 },
  key_learning_points: { type: 'string[]', required: true, minLength: 1 },
  patient_responses: { type: 'record', required: true },
  hints: { type: 'record', required: true }
};

export function validateAgainstSchema(
  data: unknown,
  schema: Record<string, FieldSchema>,
  path: string = ''
): SchemaValidationResult {
  const errors: Array<{ field: string; message: string }> = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: [{ field: path || 'root', message: 'Data is not an object' }] };
  }

  const obj = data as Record<string, unknown>;

  // Check required fields
  for (const [field, fieldSchema] of Object.entries(schema)) {
    const fieldPath = path ? `${path}.${field}` : field;
    const value = obj[field];

    // Required check
    if (fieldSchema.required && (value === undefined || value === null)) {
      errors.push({ field: fieldPath, message: `Required field is missing` });
      continue;
    }

    if (value === undefined || value === null) continue;

    // Type checking
    switch (fieldSchema.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push({ field: fieldPath, message: `Expected string, got ${typeof value}` });
        } else {
          if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
            errors.push({ field: fieldPath, message: `Minimum length is ${fieldSchema.minLength}` });
          }
          if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
            errors.push({ field: fieldPath, message: `Maximum length is ${fieldSchema.maxLength}` });
          }
          if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
            errors.push({ field: fieldPath, message: `Pattern does not match` });
          }
          if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
            errors.push({ field: fieldPath, message: `Must be one of: ${fieldSchema.enum.join(', ')}` });
          }
        }
        break;

      case 'number':
        if (typeof value !== 'number') {
          errors.push({ field: fieldPath, message: `Expected number, got ${typeof value}` });
        } else {
          if (fieldSchema.min !== undefined && value < fieldSchema.min) {
            errors.push({ field: fieldPath, message: `Minimum value is ${fieldSchema.min}` });
          }
          if (fieldSchema.max !== undefined && value > fieldSchema.max) {
            errors.push({ field: fieldPath, message: `Maximum value is ${fieldSchema.max}` });
          }
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({ field: fieldPath, message: `Expected boolean, got ${typeof value}` });
        }
        break;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push({ field: fieldPath, message: `Expected object, got ${typeof value}` });
        } else if (fieldSchema.children) {
          const childResult = validateAgainstSchema(value, fieldSchema.children, fieldPath);
          errors.push(...childResult.errors);
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push({ field: fieldPath, message: `Expected array, got ${typeof value}` });
        }
        break;

      case 'string[]':
        if (!Array.isArray(value)) {
          errors.push({ field: fieldPath, message: `Expected array of strings` });
        } else {
          if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
            errors.push({ field: fieldPath, message: `Array must have at least ${fieldSchema.minLength} items` });
          }
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] !== 'string') {
              errors.push({ field: `${fieldPath}[${i}]`, message: `Expected string at index ${i}` });
            }
          }
        }
        break;

      case 'record':
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push({ field: fieldPath, message: `Expected record object` });
        }
        break;
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateCaseData(data: unknown): SchemaValidationResult {
  return validateAgainstSchema(data, CASE_SCHEMA);
}
