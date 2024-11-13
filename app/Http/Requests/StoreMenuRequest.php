<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StoreMenuRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true; // We'll handle authorization through policies later
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'description' => 'nullable|string',
      'template_type' => 'required|in:standard,qr_code,digital_display',
      'is_active' => 'boolean',
      'files' => 'nullable|array',
      'files.*' => [
        'file',
        'mimes:jpg,jpeg,png,pdf,xlsx,xls,csv',
        'max:10240', // 10MB max per file
      ],
      // For manual item entry
      'items' => 'nullable|array',
      'items.*.name' => 'required|string|max:255',
      'items.*.description' => 'nullable|string',
      'items.*.price' => 'required|numeric|min:0',
      'items.*.category_id' => 'nullable|exists:categories,id',
      'items.*.is_available' => 'boolean',
      'items.*.tags' => 'nullable|array',
      'items.*.tags.*' => 'exists:tags,id',
    ];
  }

  public function messages(): array
  {
    return [
      'files.*.mimes' => 'Only JPG, PNG, PDF, Excel, and CSV files are allowed.',
      'files.*.max' => 'Each file must not exceed 10MB.',
      'items.*.name.required' => 'Each menu item must have a name.',
      'items.*.price.required' => 'Each menu item must have a price.',
      'items.*.price.min' => 'Price cannot be negative.',
      'items.*.category_id.exists' => 'The selected category does not exist.',
      'items.*.tags.*.exists' => 'One or more selected tags do not exist.',
    ];
  }
}
