<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateMenuRequest extends FormRequest
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
      'template_type' => 'required|in:predefined,custom',
      'is_active' => 'boolean',
      'items' => 'nullable|array',
      'items.*.id' => 'nullable|exists:menu_items,id', // For existing items
      'items.*.name' => 'required|string|max:255',
      'items.*.description' => 'nullable|string',
      'items.*.price' => 'required|numeric|min:0',
      'items.*.category_id' => 'nullable|exists:categories,id',
      'items.*.photo_path' => 'nullable|string',
      'items.*.is_available' => 'boolean',
      'items.*.tags' => 'nullable|array',
      'items.*.tags.*' => 'exists:tags,id',
      'items_to_delete' => 'nullable|array', // IDs of items to remove
      'items_to_delete.*' => 'exists:menu_items,id',
    ];
  }

  public function messages(): array
  {
    return [
      'items.*.name.required' => 'Each menu item must have a name',
      'items.*.price.required' => 'Each menu item must have a price',
      'items.*.price.min' => 'Price cannot be negative',
      'items.*.category_id.exists' => 'The selected category does not exist',
      'items.*.tags.*.exists' => 'One or more selected tags do not exist',
      'items.*.id.exists' => 'One or more menu items do not exist',
      'items_to_delete.*.exists' => 'One or more items to delete do not exist',
    ];
  }
}
